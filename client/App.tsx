import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ContactWidget from "./components/ContactWidget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import Members from "./pages/Members";
import Reports from "./pages/Reports";
import Sessions from "./pages/Sessions";
import Ideas from "./pages/Ideas";
import Account from "./pages/Account";
import About from "./pages/About";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

function ConfigChecker({ children }: { children: React.ReactNode }) {
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('PLACEHOLDER')) {
      setConfigError('Supabase is not properly configured. Please set the VITE_SUPABASE_URL environment variable.');
    }
  }, []);

  if (configError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-700 mb-4">{configError}</p>
          <p className="text-sm text-gray-600">Please contact your administrator to fix the environment configuration.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

const App = () => (
  <ConfigChecker>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ContactWidget />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/members" element={<Members />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ConfigChecker>
);

createRoot(document.getElementById("root")!).render(<App />);
