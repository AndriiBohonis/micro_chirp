'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterDto } from '@/common/dtos/auth.dto';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/app/session-context';

import { createChirpSchema } from '@/common/schemas/chirp.schema';
import { chirpCreateDto } from '@/common/dtos/chirp.dto';
import { ChirpService } from '@/services/chirps.service';
import { Textarea } from '@/components/ui/textarea';
import { ChirpModel } from '@/common/models/chirp.model';
import { PaginatedResponse } from '@/common/models/base.model';
export function ChirpForm() {
  const form = useForm<chirpCreateDto>({
    mode: 'onSubmit',
    resolver: zodResolver(createChirpSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const { control, handleSubmit } = form;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ChirpService.create,
    onMutate: async (newChirp) => {
      await queryClient.cancelQueries({ queryKey: ['chirps'] });

      const previousData = queryClient.getQueryData<InfiniteData<PaginatedResponse<ChirpModel>>>([
        'chirps',
      ]);

      queryClient.setQueryData<InfiniteData<PaginatedResponse<ChirpModel>>>(
        ['chirps'],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: [{ id: Date.now(), ...newChirp }, ...page.data],
                    meta: {
                      ...page.meta,
                      totalPages: page.meta.totalPages + 1,
                    },
                  }
                : page,
            ),
          };
        },
      );

      const toastId = toast.success('Chirp created successfully', { id: 'chirp-toast' });

      return { previousData, toastId };
    },
    onError: (error, newChirp, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.error(error.message);

      if (context?.previousData) {
        queryClient.setQueryData(['chirps'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chirps'] });
    },
  });

  const onSubmit = (data: RegisterDto) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create a Chirp</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="content" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Create
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
