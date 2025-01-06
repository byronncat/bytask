import type { Metadata } from 'next';

import { GlobalProvider } from '@/providers';
import { ToastProvider } from '@/libraries/toast';
import font from '@/assets/fonts';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Bytask',
  description: 'Organizes your tasks',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.inter.className} antialiased`}>
        <GlobalProvider>
          <ToastProvider>{children}</ToastProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
