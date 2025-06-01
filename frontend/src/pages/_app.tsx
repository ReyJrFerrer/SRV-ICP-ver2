import type { AppProps } from "next/app";
import Head from 'next/head'; 
import "tailwindcss/tailwind.css";
import "@app/styles/globals.css"; 
import "@app/styles/client-components.css";
import "@app/styles/provider.css";
import "react-datepicker/dist/react-datepicker.css";

import { Client, InternetIdentity } from "@bundly/ares-core";
import { IcpConnectContextProvider } from "@bundly/ares-react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const client = Client.create({
    agentConfig: {
      host: process.env.NEXT_PUBLIC_IC_HOST_URL!,
    },
    providers: [
      new InternetIdentity({
        providerUrl: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL!,
      }),
    ],
  });

  return (
    <IcpConnectContextProvider client={client}>
      <Head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
    
      </Head>
      <Component {...pageProps} />
    </IcpConnectContextProvider>
  );
}