import type { Metadata } from 'next';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/providers';
import { ToastProvider } from '@/libraries/toast';
import font from '@/assets/fonts';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Bytask',
  description: 'Organizes your tasks and missions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.inter.className} antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
