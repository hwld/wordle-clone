import { forwardRef, HTMLAttributes } from "react";

export const GameTile = forwardRef<
  HTMLDivElement,
  { className?: string; border: boolean } & HTMLAttributes<HTMLDivElement>
>(({ children, className, border, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex h-16 w-16 items-center justify-center 
      ${border && "border-2"} 
      ${children ? "border-neutral-500" : "border-neutral-700"}
      pb-1 text-4xl font-bold text-stone-50 
      ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
