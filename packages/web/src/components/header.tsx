'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/app/session-context';

export const Header = () => {
  const { user, logout, isLoggedIn } = useSession();
  return (
    <>
      <header className="w-full px-4 py-3 border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-black">
            Micro-Chirp
          </Link>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="font-semibold">{user?.username}</span>
                <Button className="underline" onClick={logout} variant="ghost">
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>

                <Link href="/register">
                  <Button variant="ghost">Sign Up</Button>
                </Link>
              </div>
            )}

            {/*<Link href="/create">*/}
            {/*  <Button>Create Post</Button>*/}
            {/*</Link>*/}
          </div>
        </div>
      </header>

      {/* separator optional */}
      <Separator />
    </>
  );
};
