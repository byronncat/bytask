'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useOutsideAlerter } from '@/hooks';

interface SelectionProps {
  label?: React.ReactNode;
  options: Option[];
  onClick?: () => void;
  onSelect: (value: Option['value']) => void;
  className?: string;
  inputClassName?: string;
  defaultValue?: Option['value'];
  placeholder?: string;
}

export default function Selection({
  label,
  options,
  onClick,
  onSelect,
  className,
  inputClassName,
  defaultValue,
  placeholder,
}: Readonly<SelectionProps>) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find((option) => option.default) || null,
  );

  const ref = useRef<HTMLDivElement>(null);
  useOutsideAlerter(ref, () => setShowOptions(false));

  function clickHandler() {
    setShowOptions(!showOptions);
    if (onClick) onClick();
  }

  function selectHandler(id: Option['id'], value: Option['value']) {
    const selected = options.find((option) => option.id === id) || null;
    setSelectedOption(selected);
    setShowOptions(false);
  }

  useEffect(() => {
    if (defaultValue)
      setSelectedOption(
        options.find((option) => option.value === defaultValue) || null,
      );
  }, [defaultValue, options]);

  const Selection = () => (
    <div
      className={clsx(
        'rounded',
        'w-full h-10 px-3',
        'flex items-center justify-between',
        'text-sm',
        'border border-divider',
        'cursor-pointer',
        inputClassName,
      )}
      onClick={clickHandler}
    >
      {selectedOption?.option || placeholder || 'Select'}
      <span className="text-xs">▼</span>
    </div>
  );

  const Dropdown = () => (
    <div
      className={clsx(
        'absolute top-full mt-1',
        'max-h-80 overflow-y-auto',
        'w-full z-10 py-2',
        'border border-divider',
        'rounded shadow',
        inputClassName,
        showOptions ? 'block' : 'hidden',
      )}
    >
      {options.map((option) => (
        <div
          key={option.id}
          className={clsx(
            'px-3 py-2',
            'text-sm',
            'cursor-pointer',
            option.id === selectedOption?.id
              ? 'bg-primary/[.12] border-l-2 border-primary text-primary font-semibold'
              : 'hover:bg-white/[.05] transition-[background-color] duration-150',
          )}
          onClick={() => {
            selectHandler(option.id, option.value);
          }}
        >
          {option.option}
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (selectedOption) onSelect(selectedOption.value);
  }, [onSelect, selectedOption]);

  return (
    <div className={clsx('flex flex-col', className)} ref={ref}>
      {label}
      <div className="relative">
        <Selection />
        <Dropdown />
      </div>
    </div>
  );
}
