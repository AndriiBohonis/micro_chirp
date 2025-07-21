import type { PaginatedResponse, PaginationOptions } from '@/common/models/base.model.ts';

type JoinConfig = {
  table: string;
  localKey: string;
  foreignKey: string;
  select: string[];
  as: string;
};

export const findAll = async <
  T extends Record<string, any>,
  Filter extends Partial<T> = Partial<T>,
>(
  db: any,
  tableName: string,
  options?: PaginationOptions<Filter> & {
    filter?: Filter;
    populate?: JoinConfig[];
  },
): Promise<PaginatedResponse<T>> => {
  const {
    page = 1,
    pageSize = 10,
    filter = {} as Filter,
    search,
    searchField,
    orderBy = 'created_at',
    orderDirection = 'desc',
    populate = [],
  } = options || {};

  const baseQuery = db(tableName);

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined) {
      baseQuery.andWhere(key as keyof Filter, value);
    }
  });

  if (search && searchField) {
    baseQuery.andWhere(searchField as string, 'ilike', `%${search}%`);
  }

  const totalItemsQuery = baseQuery.clone().count('* as count').first();
  const totalItems = parseInt((await totalItemsQuery).count, 10) || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const dataQuery = baseQuery
    .clone()
    .modify((qb: any) => {
      populate.forEach((pop) => {
        qb.leftJoin(pop.table, `${tableName}.${pop.localKey}`, `${pop.table}.${pop.foreignKey}`);
      });
    })
    .select([
      `${tableName}.*`,
      ...populate.flatMap((pop) =>
        pop.select.map((field) => `${pop.table}.${field} as ${pop.as}__${field}`),
      ),
    ])
    .orderBy(orderBy, orderDirection)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const rows: Record<string, any>[] = await dataQuery;

  const data: T[] = rows.map((row) => {
    const cleanRow: Record<string, any> = {};
    const nested: Record<string, Record<string, any>> = {};

    Object.entries(row).forEach(([key, value]) => {
      if (key.includes('__')) {
        const [prefix, subKey] = key.split('__');
        if (prefix && subKey) {
          if (!nested[prefix]) nested[prefix] = {};
          nested[prefix][subKey] = value;
        }
      } else {
        cleanRow[key] = value;
      }
    });

    return {
      ...cleanRow,
      ...nested,
    } as unknown as T;
  });

  return {
    data,
    meta: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
};
