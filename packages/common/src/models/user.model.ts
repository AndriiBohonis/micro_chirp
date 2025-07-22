import { BaseModel } from '@/common/models/base.model';

export type UserModel = BaseModel & {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password?: string;
};
