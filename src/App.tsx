import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiConfig } from 'wagmi';
import { Web3Modal } from '@web3modal/react';
import { config, ethereumClient } from './config/web3Config';
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Fallback WalletConnect Project ID for development
const FALLBACK_PROJECT_ID = "YOUR_FALLBACK_PROJECT_ID";

const App = () => {
  // Use fallback ID if environment variable is not set
  const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || FALLBACK_PROJECT_ID;

  return (
    <>
      <WagmiConfig config={config}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </WagmiConfig>
      <Web3Modal 
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="light"
        themeVariables={{
          '--w3m-font-family': 'Inter, sans-serif',
          '--w3m-accent-color': '#2563eb',
        }}
      />
    </>
  );
};

export default App;