import { forwardRef, HTMLAttributes } from "react";

export const GameTile = forwardRef<
  HTMLDivElement,
  { className?: string; border: boolean } & HTMLAttributes<HTMLDivElement>
>(({ children, className, border, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex h-full w-full items-center justify-center 
      ${border && "border-2"} 
      ${children ? "border-neutral-500" : "border-neutral-700"}
      select-none pb-1 text-3xl font-bold  text-stone-50
      ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
