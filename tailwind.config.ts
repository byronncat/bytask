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
        foreground: 'rgb(var(--foreground))',
        'on-foreground': 'rgb(var(--on-foreground))',
        input: 'rgb(var(--input))',
        divider: 'var(--divider)',
      },
    },
  },
  plugins: [],
} satisfies Config;
