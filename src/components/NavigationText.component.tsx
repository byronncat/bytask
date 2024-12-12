import Link from 'next/link';
import clsx from 'clsx';

interface NavigationTextProps {
  text: string;
  path: string;
  hyperlink: string;
  className: string;
}

export default function NavigationText({
  text,
  path,
  hyperlink,
  className,
}: Readonly<NavigationTextProps>) {
  return (
    <p className={className}>
      {`${text} `}
      <Link
        href={path}
        className={clsx(
          'font-semibold capitalize',
          'hover:opacity-60 transition-opacity duration-300',
        )}
      >
        {hyperlink}
      </Link>
    </p>
  );
}
