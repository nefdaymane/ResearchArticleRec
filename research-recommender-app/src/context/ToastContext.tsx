"use client";

import React, { createContext, useContext, useState } from "react";
import Toast from "@/components/ui/toast";

type ToastMessage = {
    title: string;
    description: string;
    variant: "success" | "error" | "info";
};

type ToastContextType = {
    addToast: (title: string, description: string, variant: "success" | "error" | "info") => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = (title: string, description: string, variant: "success" | "error" | "info") => {
        const newToast: ToastMessage = { title, description, variant };
        setToasts((prev) => [...prev, newToast]);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-0 right-0 p-4 z-50">
                {toasts.map((toast, index) => (
                    <Toast
                        key={index}
                        title={toast.title}
                        description={toast.description}
                        variant={toast.variant}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
