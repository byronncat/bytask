import type { Config } from 'tailwindcss';

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        'on-background': 'rgb(var(--on-background))',
        primary: 'rgb(var(--primary))',
        'on-primary': 'rgb(var(--on-primary))',
        'surface-1': 'rgb(var(--surface-1))',
        'on-surface-1': 'rgb(var(--on-surface-1))',
        'surface-2': 'rgb(var(--surface-2))',
        'on-surface-2': 'rgb(var(--on-surface-2))',
        divider: 'var(--divider)',
      },
    },
  },
  plugins: [],
} satisfies Config;
