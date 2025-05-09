import { NotifiSmartLinkExample } from '@/components/NotifiSmartLinkExample';
import '@notifi-network/notifi-react/dist/index.css';
import React from 'react';

export async function generateStaticParams() {
  // Replace this with your supported SmartLink IDs
  return [
    { slug: '1e74002c84f3445480c54424a145a62a' }, // Active SmartLink (on Prod)
    { slug: '1302fc05485341eab8931e759cc0a08c' }, // Active SmartLink (on Dev)
    { slug: '49f71f1b980742859c5e2ff6b1daef94' }, // Disabled SmartLink (on Dev)
    { slug: 'f58cbfe9c82d4311bf44fd4c37bee425' }, // Disabled SmartLink (on Dev)
  ];
}
export default function Page() {
  return <NotifiSmartLinkExample />;
}
