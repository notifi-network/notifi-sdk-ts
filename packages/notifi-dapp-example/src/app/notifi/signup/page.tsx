'use client';

import {
  useFrontendClientLogin,
  useNotifiClientContext,
} from '@notifi-network/notifi-react-card';

export default function NotifiSignup() {
  const {
    frontendClientStatus: { isAuthenticated, isInitialized },
  } = useNotifiClientContext();
  const login = useFrontendClientLogin();

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      Dummy Signup Page {JSON.stringify({ isAuthenticated, isInitialized })}
      <button className="p-5 bg-green-50" onClick={() => login()}>
        Sign-up
      </button>
    </div>
  );
}
