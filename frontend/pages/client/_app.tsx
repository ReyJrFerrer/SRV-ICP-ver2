import React from 'react';
import { AppProps } from 'next/app';
import '../../ui/styles/globals.css';

export default function ClientApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
