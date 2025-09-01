import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full h-12 px-3 rounded-md bg-gray-50 border border-gray-200 
          focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none 
          transition-colors ${className}`}
      {...props}
    />
  )
);

Input.displayName = "Input";
