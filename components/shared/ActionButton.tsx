import * as React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
    const baseClasses = 'px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800';
    const variantClasses = {
        primary: 'bg-cyan-600 text-white hover:bg-cyan-500 focus:ring-cyan-500',
        secondary: 'bg-gray-600 text-gray-200 hover:bg-gray-500 focus:ring-gray-500',
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};