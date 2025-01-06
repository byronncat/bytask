'use client';

import type { ChartData } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import ChartJS from 'chart.js/auto';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

interface ChartProps {
  data: ChartData<'pie'> | ChartData<'line'> | ChartData<'bar' | 'line'>;
  type?: 'pie' | 'line' | 'bar';
}

export default function Chart({ data, type = 'pie' }: Readonly<ChartProps>) {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const ctx = canvasElement.current?.getContext('2d');
    if (ctx) {
      if (chartInstance.current) chartInstance.current.destroy();
      const textColor = theme === 'dark' ? 'white' : 'black';
      chartInstance.current = new ChartJS(ctx, {
        type: type,
        data: {
          ...data,
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: textColor,
              },
            },
          },
          scales:
            type === 'line'
              ? {
                  x: {
                    ticks: {
                      color:
                        theme === 'dark'
                          ? 'rgba(255, 255, 255, 0.6)'
                          : 'rgba(0, 0, 0, 0.6)',
                    },
                    grid: {
                      color:
                        theme === 'dark'
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'rgba(0, 0, 0, 0.2)',
                    },
                  },
                  y: {
                    ticks: {
                      color: textColor,
                    },
                    grid: {
                      color:
                        theme === 'dark'
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'rgba(0, 0, 0, 0.2)',
                    },
                  },
                }
              : undefined,
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, theme, type]);

  return (
    <div className={clsx('size-full', 'flex items-center justify-center')}>
      <canvas ref={canvasElement} />
    </div>
  );
}
