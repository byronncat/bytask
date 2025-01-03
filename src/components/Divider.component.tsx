import clsx from 'clsx';

interface DividerProps {
  text?: string;
  className?: string;
}

export default function Divider({ text, className }: Readonly<DividerProps>) {
  return (
    <div
      className={clsx(
        className,
        'flex items-center',
        text
          ? 'before:flex-1 before:border-t before:me-4 after:flex-1 after:border-t after:ms-4'
          : 'before:flex-1 before:border-t',
        'text-black/[.6] dark:text-white/[.6]',
        'before:border-divider after:border-divider',
      )}
    >
      {text}
    </div>
  );
}
