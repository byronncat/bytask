'use client';

import { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useOutsideAlerter } from '@/hooks';
import { parseToHexColor } from '@/utilities';
import { errorClassName, formClassName } from '../../Form/className';

const DEFAULT_COLOR = [
  '#4CAF50', // Green
  '#FFC107', // Yellow
  '#FF9800', // Orange
  '#F44336', // Red
  '#9C27B0', // Purple
  '#2196F3', // Blue
] as HexColor[];

interface ColorPickerProps {
  label?: React.ReactNode;
  onSelect: (color: HexColor) => void;
  className?: string;
  defaultValue?: HexColor;
}

export default function ColorPicker({
  label,
  onSelect,
  className,
  defaultValue,
}: Readonly<ColorPickerProps>) {
  const [showCustom, setShowCustom] = useState(false);
  const [selectedColor, setSelectedColor] = useState<HexColor | null>(
    defaultValue || null,
  );
  const isDefaultColor = selectedColor && DEFAULT_COLOR.includes(selectedColor);

  function selectHandler(color: HexColor) {
    if (selectedColor === color) {
      setSelectedColor(null);
      onSelect('');
      return;
    }
    setSelectedColor(color);
    onSelect(color);
  }

  useEffect(() => {
    setSelectedColor(defaultValue || null);
  }, [defaultValue]);

  return (
    <div className={clsx(className, 'relative')}>
      {label}
      <div className="flex flex-wrap gap-2">
        {DEFAULT_COLOR.map((color) => (
          <button
            type="button"
            key={color}
            className={clsx(
              'w-10 h-8',
              'rounded',
              'hover:opacity-80 hover:shadow-md transition-all duration-150',
            )}
            style={{ backgroundColor: color }}
            onClick={() => selectHandler(color)}
            aria-label={`Select color ${color}`}
          >
            {selectedColor === color && (
              <FontAwesomeIcon icon={faCheck} className="text-white size-3" />
            )}
          </button>
        ))}
        {!isDefaultColor && selectedColor && (
          <button
            type="button"
            className={clsx(
              'w-10 h-8',
              'rounded',
              'flex items-center justify-center',
            )}
            style={{ backgroundColor: selectedColor }}
            onClick={() => selectHandler('')}
          >
            <FontAwesomeIcon icon={faCheck} className="text-white size-3" />
          </button>
        )}
        <button
          type="button"
          className={clsx(
            'w-10 h-8',
            'rounded',
            'bg-on-foreground/[.12]',
            'flex items-center justify-center',
            'hover:bg-on-foreground/[.24] transition-[background-color] duration-150',
          )}
          onClick={() => setShowCustom(true)}
          aria-label="Select new color"
        >
          <FontAwesomeIcon
            icon={faPlus}
            className="text-on-foreground size-3"
          />
        </button>
        <button
          type="button"
          className={clsx(
            'text-primary text-sm font-semibold',
            'hover:underline',
          )}
          onClick={() => selectHandler('')}
          aria-label="Clear color"
        >
          Clear
        </button>
        {showCustom && (
          <CustomModal
            onSelect={selectHandler}
            onExit={() => setShowCustom(false)}
          />
        )}
      </div>
    </div>
  );
}

interface CustomModalProps {
  onSelect: (color: HexColor) => void;
  onExit: () => void;
}

function CustomModal({ onSelect, onExit }: Readonly<CustomModalProps>) {
  const [customColor, setCustomColor] = useState('');
  const [error, setError] = useState('');
  const ref = useRef(null);
  useOutsideAlerter(ref, () => onExit());

  return (
    <div
      ref={ref}
      className={clsx(
        'absolute top-0 right-0 z-10',
        'px-3 py-4 mt-6',
        'bg-background rounded shadow-lg',
        'border border-divider',
      )}
    >
      <input
        id="customColor"
        type="text"
        value={customColor}
        onChange={(e) => {
          if (error) setError('');
          setCustomColor(e.target.value);
        }}
        placeholder="Hex color (e.g. #FFFFFF)"
        className={clsx(
          'w-full h-10',
          error ? 'border-red-500' : 'border-divider',
          formClassName,
        )}
      />
      {error && <p className={clsx(errorClassName, 'mt-1')}>{error}</p>}
      <button
        type="button"
        className={clsx(
          'w-10 h-8 mt-3 ml-auto',
          'rounded',
          'bg-primary text-background',
          'font-semibold',
          'flex items-center justify-center',
          'hover:bg-on-foreground/[.24] transition-[background-color] duration-150',
        )}
        onClick={() => {
          const hexColor = parseToHexColor(customColor);
          if (hexColor) {
            onSelect(hexColor);
            onExit();
          } else setError('Invalid color');
        }}
        aria-label="Clear custom color"
      >
        Set
      </button>
    </div>
  );
}
