import { ReactNode } from "react";

export const GameTile: React.VFC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-md border-2 border-stone-500 pb-1 text-4xl font-bold text-stone-50 ${className}`}
    >
      {children}
    </div>
  );
};
