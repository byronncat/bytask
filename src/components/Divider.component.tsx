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
        'text-on-foreground/[0.6]',
        'before:border-on-foreground/[.4] after:border-on-foreground/[.4]',
      )}
    >
      {text}
    </div>
  );
}
