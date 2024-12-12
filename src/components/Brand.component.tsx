import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

interface BrandProps {
  hyperlink?: boolean;
}

export default function Brand({ hyperlink = false }: Readonly<BrandProps>) {
  if (hyperlink) {
    return (
      <Link href="/" className={clsx('flex items-center', 'w-fit')}>
        <LogoAndText />
      </Link>
    );
  }

  return (
    <div className={clsx('flex items-center', 'w-fit')}>
      <LogoAndText />
    </div>
  );
}

function LogoAndText() {
  return (
    <>
      <Image
        src="/logo.svg"
        alt="logo"
        width={32}
        height={32}
        className="rounded-md"
      />
      <span className={clsx('ml-2', 'font-bold text-lg')}>Bynote</span>
    </>
  );
}
