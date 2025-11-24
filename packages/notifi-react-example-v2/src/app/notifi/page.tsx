'use client';

import { useRouter } from 'next/navigation';

export default function NotifiHome() {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.push('/notifi/components-example')}>
        Notifi Component Example
      </button>
      <br />
      <button onClick={() => router.push('/notifi/context-example')}>
        Notifi Context Example (Advanced)
      </button>
      <br />
      <button
        onClick={() => router.push('/notifi/midnight-test')}
        style={{
          marginTop: '10px',
          backgroundColor: '#6f42c1',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        🌙 Lace Wallet (Cardano/Midnight) Test
      </button>
    </div>
  );
}
