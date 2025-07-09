'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

function LoadingScreen() {
    // This provides a skeleton layout that mimics the actual app structure
    // to prevent jarring layout shifts while the authentication state is loading.
    return (
        <div className="flex h-screen w-full bg-background">
            <div className="hidden h-full flex-col border-l bg-sidebar p-2 text-sidebar-foreground rtl:border-l-0 rtl:border-r md:flex w-[16rem]">
                <div className="flex h-[80px] items-center justify-center p-2">
                    <Skeleton className="h-[60px] w-[120px]" />
                </div>
                <div className="flex flex-1 flex-col gap-2 overflow-auto p-2">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-full rounded-md" />)}
                </div>
                <div className="p-2">
                    <Skeleton className="my-2 h-px w-full" />
                    <div className="flex items-center gap-3 p-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm lg:h-[60px] lg:px-6">
                    <div className="w-full flex-1">
                        <Skeleton className="h-8 md:w-2/3 lg:w-1/3" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </header>
                <main className="flex-1 p-4 lg:p-6">
                    <Skeleton className="mb-6 h-10 w-48" />
                    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
                    </div>
                    <Skeleton className="h-96 w-full" />
                </main>
            </div>
        </div>
    );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !isLoginPage) {
        router.push('/login');
      } else if (user && isLoginPage) {
        router.push('/');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, isLoginPage, pathname]);

  if (loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
