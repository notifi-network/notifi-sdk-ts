import { NotifiSmartLinkExample } from '@/components/NotifiSmartLinkExample';
import '@notifi-network/notifi-react/dist/index.css';
import React from 'react';

export async function generateStaticParams() {
  // Replace this with your supported SmartLink IDs
  return [
    { slug: '66881b08-189b-4276-9ca0-9cd6fe099b4a' },
    { slug: '0f624c59e09a4d2183a79bfc95177c67' },
  ];
}
export default function Page() {
  return <NotifiSmartLinkExample />;
}
