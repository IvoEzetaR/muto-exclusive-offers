import React from 'react'
import ReactDOM from 'react-dom/client'
import { FormQR } from './FormQR'
import '../../src/index.css'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import logo from '../../src/assets/muto-logo.png';
import Scanner from './components/Scanner';

const queryClient = new QueryClient();

// Simple routing based on pathname
const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                {path === '/scan' ? (
                    <Scanner />
                ) : (
                    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                        <div className="w-full max-w-md mb-8 flex flex-col items-center">
                            <img
                                src={logo}
                                alt="Muto Logo"
                                className="h-24 w-auto mb-6 transition-all duration-500 hover:scale-105"
                            />
                            <h1 className="text-2xl font-semibold text-foreground text-center">Registro de Invitados</h1>
                            <p className="text-muted-foreground text-center mt-2">Completa tus datos para recibir ofertas exclusivas</p>
                        </div>
                        <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-xl border border-border/50">
                            <FormQR />
                        </div>
                    </div>
                )}
                <Toaster />
                <Sonner />
            </TooltipProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
