import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = "", ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full h-12 px-3 rounded-md bg-gray-50 border border-gray-200 
          focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none 
          transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);

Select.displayName = "Select";
