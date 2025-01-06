import clsx from 'clsx';

interface LabelProps {
  id?: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  dot?: boolean;
}

export default function Label({
  id,
  label,
  children,
  dot,
}: Readonly<LabelProps>) {
  if (id)
    return (
      <label
        className={clsx(
          'text-xs font-semibold tracking-wide',
          'mb-1 inline-block',
        )}
        htmlFor={id}
      >
        {label || children} {dot && <span className="text-red-500">*</span>}
      </label>
    );

  return (
    <div
      className={clsx(
        'text-xs font-semibold tracking-wide',
        'mb-1 inline-block',
      )}
    >
      {label || children} {dot && <span className="text-red-500">*</span>}
    </div>
  );
}
