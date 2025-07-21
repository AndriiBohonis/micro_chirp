'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { PaginatedResponse } from '@/common/models/base.model';
import { ChirpModel } from '@/common/models/chirp.model';
import { Loader2 } from 'lucide-react';
import { ChirpService, PaginationParams } from '@/services/chirps.service';
import { ChirpCard } from '@/components/chirp-card';
import { ChirpForm } from '@/components/forms/chirp-form';
import { useSession } from '@/app/session-context';
import { toast } from 'sonner';

export default function HomePage() {
  const { isLoggedIn, user } = useSession();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    PaginatedResponse<ChirpModel>
  >({
    queryKey: ['chirps'],
    queryFn: async ({ pageParam }) => {
      return await ChirpService.getAll({ page: pageParam } as PaginationParams);
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return +page < totalPages ? +page + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteChirp } = useMutation({
    mutationFn: (id: number) => ChirpService.delete(id),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['chirps'] });

      const previousData = queryClient.getQueryData(['chirps']);

      queryClient.setQueryData(['chirps'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((c: ChirpModel) => c.id !== id),
          })),
        };
      });

      return { previousData };
    },

    onError: (_error, _variables, context) => {
      toast.error('Failed to delete chirp. Rolling back...');
      if (context?.previousData) {
        queryClient.setQueryData(['chirps'], context.previousData);
      }
    },

    onSuccess: () => {
      toast.success('Chirp deleted successfully!');
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef.current, hasNextPage]);

  return (
    <div className="py-4 container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          {isLoggedIn ? <ChirpForm /> : <div>Please login to create a chirp</div>}
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col gap-4">
            {data?.pages.map((page) =>
              page.data.map((item) => (
                <ChirpCard userId={user?.id} deleteChirp={deleteChirp} key={item.id} chirp={item} />
              )),
            )}
            <div ref={observerRef} className="h-10" />
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
