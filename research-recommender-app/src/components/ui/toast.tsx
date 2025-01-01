import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastProps = {
    title: string;
    description: string;
    variant: "success" | "error" | "info";
};

const Toast: React.FC<ToastProps> = ({ title, description, variant }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 300);
    };

    if (!isVisible) return null;

    const variants = {
        success: {
            icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-500",
            titleColor: "text-emerald-700",
            textColor: "text-emerald-600"
        },
        error: {
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
            bgColor: "bg-red-50",
            borderColor: "border-red-500",
            titleColor: "text-red-700",
            textColor: "text-red-600"
        },
        info: {
            icon: <Info className="w-5 h-5 text-blue-500" />,
            bgColor: "bg-blue-50",
            borderColor: "border-blue-500",
            titleColor: "text-blue-700",
            textColor: "text-blue-600"
        }
    };

    const currentVariant = variants[variant];

    return (
        <div
            className={`
                fixed top-4 right-4 flex items-start gap-3 p-4 rounded-lg shadow-lg w-96
                ${currentVariant.bgColor}
                ${currentVariant.borderColor} border
                transform transition-all duration-300 ease-in-out
                ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
            `}
        >
            <div className="flex-shrink-0">
                {currentVariant.icon}
            </div>
            
            <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium mb-1 ${currentVariant.titleColor}`}>
                    {title}
                </h3>
                <p className={`text-sm ${currentVariant.textColor}`}>
                    {description}
                </p>
            </div>

            <button
                onClick={handleClose}
                className="flex-shrink-0 ml-2 mt-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;