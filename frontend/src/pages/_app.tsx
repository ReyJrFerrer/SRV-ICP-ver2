import type { AppProps } from "next/app";
import Head from 'next/head'; 
import { useEffect } from "react";
import "tailwindcss/tailwind.css";
import "@app/styles/globals.css";
import "@app/styles/client-components.css";
import "@app/styles/provider.css";
import "react-datepicker/dist/react-datepicker.css";

import { Client, InternetIdentity } from "@bundly/ares-core";
import { IcpConnectContextProvider } from "@bundly/ares-react";
import { initializeCanisterNetwork } from "../utils/canisterStartup";
import { AuthWrapper } from "../contexts/AuthWrapper";

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

  // Initialize canisters on app startup with a small delay
  useEffect(() => {
    const initializeWithDelay = async () => {
      try {
        // Small delay to ensure auth context is ready
        await new Promise((resolve) => setTimeout(resolve, 100));
        await initializeCanisterNetwork();
        console.log("Canister network initialized successfully");
      } catch (error) {
        console.error("Failed to initialize canister network at startup:", error);
      }
    };

    initializeWithDelay();
  }, []);

  return (
    <IcpConnectContextProvider client={client}>
      <Head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </Head>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </IcpConnectContextProvider>
  );
}
