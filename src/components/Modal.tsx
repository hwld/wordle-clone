import { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

export const Modal: React.VFC<{
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}> = ({ isOpen, onClose, children }) => {
  return (
    <div>
      {isOpen && (
        <div className={`${isOpen ? "animate-fade" : ""}`}>
          <div
            className={`fixed top-0 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.5)]`}
          >
            <div className="h-80 w-80 rounded-md bg-neutral-700 p-4">
              <div className="relative flex h-full items-center justify-center text-neutral-50">
                <button
                  className="absolute top-[-0.75rem] right-[-0.75rem] flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800"
                  onClick={onClose}
                >
                  <IoMdClose size={"70%"} />
                </button>

                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
