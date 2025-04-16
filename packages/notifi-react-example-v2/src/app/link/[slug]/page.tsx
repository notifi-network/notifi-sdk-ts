import { NotifiSmartLinkExample } from '@/components/NotifiSmartLinkExample';
import '@notifi-network/notifi-react/dist/index.css';
import React from 'react';

export async function generateStaticParams() {
  // Replace this with your supported SmartLink IDs
  return [
    { slug: '49f71f1b980742859c5e2ff6b1daef94' },
    { slug: 'f58cbfe9c82d4311bf44fd4c37bee425' },
  ];
}
export default function Page() {
  return <NotifiSmartLinkExample />;
}
