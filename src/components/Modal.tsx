import { ReactNode, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";

export const Modal: React.VFC<{
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const [startClose, setStartClose] = useState(false);

  const animation = useMemo(() => {
    if (startClose) {
      return "animate-fadeOut";
    }
    if (isOpen) {
      return "animate-fadeIn";
    }
    return "";
  }, [isOpen, startClose]);

  const startCloseAnimation = () => {
    setStartClose(true);
  };

  const handleAnimationEnd = ({ animationName }: React.AnimationEvent) => {
    if (animationName === "fadeOut") {
      onClose();
      setStartClose(false);
    }
  };

  return (
    <div>
      {isOpen && (
        <div
          className={`fixed top-0 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.5)]`}
          onAnimationEnd={handleAnimationEnd}
        >
          <div
            className={`${animation} relative flex h-80 w-80 flex-col items-center justify-center rounded-md bg-neutral-700 p-4 text-neutral-50`}
          >
            <button
              className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800 hover:bg-neutral-900"
              onClick={startCloseAnimation}
            >
              <IoMdClose size={"70%"} />
            </button>

            {children}
          </div>
        </div>
      )}
    </div>
  );
};
