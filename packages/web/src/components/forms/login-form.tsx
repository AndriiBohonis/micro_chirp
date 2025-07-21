'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { LoginDto } from '@/common/dtos/auth.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/common/schemas/auth.schema';
import { useMutation } from '@tanstack/react-query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';
import { useSession } from '@/app/session-context';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const { login } = useSession();
  const router = useRouter();
  const form = useForm<LoginDto>({
    mode: 'onSubmit',
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit, control } = form;

  const mutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      const token = data.access_token;
      const user = data.user;
      login(token, user);
      router.push('/');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: LoginDto) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="test@rest.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
