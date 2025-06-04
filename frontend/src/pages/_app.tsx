import type { AppProps } from "next/app";
import { useEffect } from "react";
import "tailwindcss/tailwind.css";
import "@app/styles/globals.css";
import "@app/styles/client-components.css";
import "@app/styles/provider.css";
import "react-datepicker/dist/react-datepicker.css";

import { Client, InternetIdentity } from "@bundly/ares-core";
import { IcpConnectContextProvider } from "@bundly/ares-react";
import { initializeCanisterNetwork } from "../utils/canisterStartup";

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

  // Initialize canisters on app startup
  useEffect(() => {
    initializeCanisterNetwork().catch((error) => {
      console.error('Failed to initialize canister network at startup:', error);
    });
  }, []);

  return (
    <IcpConnectContextProvider client={client}>
      <Component {...pageProps} />
    </IcpConnectContextProvider>
  );
}
