'use client';

import { useRouter } from 'next/navigation';

export default function NotifiHome() {
  const router = useRouter();
  return (
    <div>
      <button
        className="plain-button"
        onClick={() => router.push('/notifi/components-example')}
      >
        Notifi Component Example
      </button>
      <br />
      <button
        className="plain-button"
        onClick={() => router.push('/notifi/context-example')}
      >
        Notifi Context Example (Advanced)
      </button>
    </div>
  );
}
