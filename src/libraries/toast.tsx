'use client';

import { ToastContainer, toast as reactToastify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const toast = {
  loading: (message: string) => reactToastify.loading(message),
  success: (message: string) => {
    reactToastify.dismiss();
    reactToastify.success(message);
  },
  error: (message: string) => {
    reactToastify.dismiss();
    reactToastify.error(message);
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer theme="colored" />
    </>
  );
}
