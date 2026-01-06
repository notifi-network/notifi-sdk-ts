import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export const useRouterAsync = () => {
  const [isLoadingRouter, setIsLoadingRouter] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRoute = async (path: string, preserveSearchParams?: boolean) => {
    let finalPath = path;
    if (preserveSearchParams && typeof window !== 'undefined') {
      const currentSearchParams = new URLSearchParams(window.location.search);
      const searchString = currentSearchParams.toString();
      if (searchString) {
        finalPath = `${path}${path.includes('?') ? '&' : '?'}${searchString}`;
      }
    }
    // Note: utilize startTransition because router.push no longer returns a promise. [detail](https://stackoverflow.com/questions/76253446/await-navigation-with-router-from-next-navigation/77931487#77931487)
    startTransition(() => {
      router.push(finalPath);
    });
  };

  useEffect(() => {
    if (isPending) {
      return setIsLoadingRouter(true);
    }
    setIsLoadingRouter(false);
  }, [isPending]);

  return { handleRoute, isLoadingRouter };
};
