import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { ROUTE } from '@/constants/serverConfig';

interface BrandProps {
  hyperlink?: boolean;
  className?: string;
}

export default function Brand({
  hyperlink = true,
  className,
}: Readonly<BrandProps>) {
  const Content = () => (
    <div className={clsx('flex items-center', 'inline-block', className)}>
      <LogoAndText />
    </div>
  );

  if (hyperlink)
    return (
      <Link href={ROUTE.LANDING}>
        <Content />
      </Link>
    );
  return <Content />;
}

function LogoAndText() {
  return (
    <>
      <span
        className={clsx('inline-block', 'h-full aspect-square', 'relative')}
      >
        <Image
          src="/logo.svg"
          alt="logo"
          className="rounded-md"
          fill
          sizes="40px"
        />
      </span>
      <span className={clsx('ml-2', 'font-bold text-lg')}>Bynote</span>
    </>
  );
}
