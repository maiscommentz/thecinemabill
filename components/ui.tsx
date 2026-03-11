import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Brutalist Input
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn(
                "flex h-12 w-full brutal-border bg-white px-3 py-2 text-sm",
                "placeholder:text-gray-500 focus:outline-none focus:ring-0 brutal-shadow-sm transition-shadow",
                "focus:brutal-shadow",
                className
            )}
            {...props}
        />
    );
});
Input.displayName = "Input";

// Brutalist Button
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center h-14 font-bold uppercase tracking-wider",
                "bg-[#FDE047] brutal-border brutal-shadow transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
                "hover:bg-[#fde047]/90",
                className
            )}
            {...props}
        />
    );
});
Button.displayName = "Button";

// Brutalist Select (Wrapper for native select)
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => {
    return (
        <div className="relative">
            <select
                ref={ref}
                className={cn(
                    "flex h-12 w-full appearance-none brutal-border bg-white px-3 py-2 text-sm font-semibold",
                    "focus:outline-none focus:ring-0 brutal-shadow-sm focus:brutal-shadow transition-shadow",
                    className
                )}
                {...props}
            >
                {children}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none brutal-border border-y-0 border-r-0 border-l-2 bg-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
});
Select.displayName = "Select";

// Brutalist Switch (Toggle)
export const Switch = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center brutal-border transition-colors",
                checked ? "bg-black" : "bg-white"
            )}
        >
            <span
                className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform bg-white brutal-border transition-transform",
                    checked ? "translate-x-5" : "translate-x-0.5",
                    checked && "bg-white"
                )}
            />
        </button>
    );
};
