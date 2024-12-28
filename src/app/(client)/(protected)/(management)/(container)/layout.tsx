import clsx from 'clsx';
import { Divider } from '@/components';
import { Header } from './_components';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={clsx('size-full max-w-7xl', 'mx-auto p-8', 'overflow-y-auto')}
    >
      <Header />
      <Divider className="my-8" />
      {children}
    </div>
  );
}
