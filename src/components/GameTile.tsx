import { HTMLAttributes } from "react";

export const GameTile: React.VFC<
  {
    children: string | undefined;
    className?: string;
  } & HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...props }) => {
  return (
    <div
      className={`flex h-16 w-16 items-center justify-center border-2 ${
        children ? "border-neutral-500" : "border-neutral-700"
      }  pb-1 text-4xl font-bold text-stone-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
