import React from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full p-3 rounded-md bg-gray-50 border border-gray-200 
        focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none 
        transition-colors min-h-[120px] ${className}`}
      {...props}
    />
  )
);

TextArea.displayName = "TextArea";
