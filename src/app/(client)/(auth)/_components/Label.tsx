import clsx from 'clsx';

interface LabelProps {
  id: string;
  children: React.ReactNode;
}

export default function Label({ id, children }: Readonly<LabelProps>) {
  return (
    <label
      htmlFor={id}
      className={clsx(
        'block mb-1',
        'text-sm font-medium text-on-background/[.7]',
      )}
    >
      {children}
    </label>
  );
}
