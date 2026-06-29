import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
export const buttonVariants = ({ variant = "default", size = "default", className = "" }: { variant?: ButtonProps["variant"], size?: ButtonProps["size"], className?: string } = {}) => {
  const baseClass = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";
  
  let variantClass = "";
  switch (variant) {
    case "default":
      variantClass = "bg-[#FD5E4B] text-white hover:bg-[#E45D36] shadow-lg shadow-[#FD5E4B]/30 hover:shadow-xl hover:-translate-y-0.5";
      break;
    case "destructive":
      variantClass = "bg-red-500 text-slate-50 hover:bg-red-500/90";
      break;
    case "outline":
      variantClass = "border-2 border-[#6B1D1D] bg-white text-[#6B1D1D] hover:bg-[#6B1D1D]/5";
      break;
    case "secondary":
      variantClass = "bg-[#6B1D1D] text-white hover:bg-[#5b1818] shadow-md shadow-[#6B1D1D]/20";
      break;
    case "ghost":
      variantClass = "hover:bg-zinc-100 hover:text-zinc-900";
      break;
    case "link":
      variantClass = "text-[#6B1D1D] underline-offset-4 hover:underline";
      break;
  }

  let sizeClass = "";
  switch (size) {
    case "default":
      sizeClass = "h-10 px-6 py-2";
      break;
    case "sm":
      sizeClass = "h-9 rounded-full px-4 text-xs";
      break;
    case "lg":
      sizeClass = "h-12 rounded-full px-8 text-base";
      break;
    case "icon":
      sizeClass = "h-10 w-10";
      break;
  }

  return `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = "button";
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
