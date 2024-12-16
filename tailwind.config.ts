import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        'surface-1': 'rgb(var(--surface-1))',
        'surface-2': 'rgb(var(--surface-2))',
        'on-background': 'rgb(var(--on-background))',
        'on-foreground': 'rgb(var(--on-foreground))',
        'on-surface-1': 'rgb(var(--on-surface-1))',
        'on-surface-2': 'rgb(var(--on-surface-2))',
        border: 'var(--border)',
        contrast: 'rgb(var(--contrast))',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
} satisfies Config;
