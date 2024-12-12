'use client';

import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 },
];

export default function Page() {
  const canvasElement = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasElement.current?.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map((row) => row.year),
          datasets: [
            {
              label: 'Acquisitions by year',
              data: data.map((row) => row.count),
              backgroundColor: 'rgb(98, 162, 235)',
            },
          ],
        },
      });
    }
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <canvas ref={canvasElement}></canvas>
    </div>
  );
}
