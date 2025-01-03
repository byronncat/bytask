import clsx from 'clsx';

const className = {
  text: clsx('px-3', 'sm:text-sm'),
  appearance: 'border rounded shadow-sm',
  focused: clsx(
    'focus-visible:outline-none',
    'focus:border-on-background',
    'focus:ring focus:ring-divider focus:ring-opacity-50',
  ),
};

export const formClassName = clsx(
  className.text,
  className.appearance,
  className.focused,
);
export const errorClassName = clsx('text-xs text-red-500 italic');
