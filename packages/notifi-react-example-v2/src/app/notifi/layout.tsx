import { NotifiContextWrapper } from '@/context/NotifiContextWrapper';
import { Suspense } from 'react';

export default function NotifiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <NotifiContextWrapper>{children}</NotifiContextWrapper>
    </Suspense>
  );
}
