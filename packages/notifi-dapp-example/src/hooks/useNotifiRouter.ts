import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export const useNotifiRouter = () => {
  const { frontendClientStatus } = useNotifiClientContext();
  const router = useRouter();

  const routeAvailable = useMemo(() => {
    return frontendClientStatus.isInitialized;
  }, [frontendClientStatus]);

  useEffect(() => {
    if (frontendClientStatus.isExpired) {
      return router.push('/notifi/expired');
    }
    // TODO: FTU page route
    if (frontendClientStatus.isAuthenticated) {
      return router.push('/notifi/dashboard');
    }
    return router.push('/notifi/signup');
  }, [frontendClientStatus]);

  return routeAvailable;
};
