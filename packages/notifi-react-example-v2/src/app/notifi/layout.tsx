import { NotifiContextWrapper } from '@/context/NotifiContextWrapper';

export default function NotifiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NotifiContextWrapper>{children}</NotifiContextWrapper>;
}
