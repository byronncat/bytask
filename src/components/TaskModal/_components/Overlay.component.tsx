import clsx from 'clsx';

export default function Overlay({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={clsx(
        'fixed inset-0 z-20',
        'flex items-center justify-center',
        'bg-black/[.5]',
      )}
    >
      {children}
    </div>
  );
}
