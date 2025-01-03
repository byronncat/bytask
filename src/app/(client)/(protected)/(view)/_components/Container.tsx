import clsx from 'clsx';

export default function Container({
  children,
  className,
  style,
  colorLine,
}: Readonly<{
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  colorLine?: string;
}>) {
  return (
    <div
      className={clsx('h-24', 'rounded-md', 'text-sm', 'flex', className)}
      style={style}
    >
      <span className="h-full w-1" style={{ backgroundColor: colorLine }} />
      <div>{children}</div>
    </div>
  );
}
