import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export const useRouterAsync = () => {
  const [isLoadingRouter, setIsLoadingRouter] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRoute = async (path: string) => {
    // Note: utilize startTransition because router.push no longer returns a promise. [detail](https://stackoverflow.com/questions/76253446/await-navigation-with-router-from-next-navigation/77931487#77931487)
    startTransition(() => {
      router.push(path);
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
