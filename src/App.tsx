
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivityProvider } from "./context/ActivityContext";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Exercise from "./pages/Exercise";
import Meditation from "./pages/Meditation";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ActivityProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/exercise" element={<Exercise />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Navbar />
        </BrowserRouter>
      </TooltipProvider>
    </ActivityProvider>
  </QueryClientProvider>
);

export default App;
