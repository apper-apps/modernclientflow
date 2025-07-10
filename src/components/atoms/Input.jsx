import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  error,
  as = "input",
  ...props 
}, ref) => {
const Component = as;
  
  return (
    <Component
      type={as === "input" ? type : undefined}
      className={cn(
        "flex w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white",
        "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400",
        "transition-all duration-200",
        as === "textarea" && "resize-vertical min-h-[80px]",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;