'useClient';

import { NotifiCardModalContextWrapper } from '@/context/NotifiContext';

export default function NotifiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotifiCardModalContextWrapper>{children}</NotifiCardModalContextWrapper>
  );
}
