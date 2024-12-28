import clsx from 'clsx';

export default function Container({
  children,
  className,
  style,
}: Readonly<{
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}>) {
  return (
    <div
      className={clsx('h-24', 'rounded-lg', 'text-sm', className)}
      style={style}
    >
      {children}
    </div>
  );
}
