import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { config } from "../utils/wagmiConfig";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setIsDark(stored !== "light");
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={isDark ? darkTheme({ accentColor: "#4f46e5" }) : lightTheme({ accentColor: "#4f46e5" })}>
          <div className="min-h-screen">
            <Navbar />
            <main className="pt-16 page-enter">
              <Component {...pageProps} />
            </main>
          </div>
          <Toaster position="bottom-right" toastOptions={{
            style: { background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }
          }} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
