import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export const LegacyButton: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = "rounded-full font-medium transition-all duration-300 flex items-center justify-center tracking-tight";

    const variants = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 border border-transparent",
        secondary: "bg-white text-slate-900 hover:bg-gray-100 border border-transparent shadow-sm",
        outline: "bg-transparent text-slate-900 border border-slate-900 hover:bg-slate-900 hover:text-white"
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
