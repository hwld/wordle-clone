import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

export const Modal: React.VFC<{
  isOpen: boolean;
  onClose: () => void;
  onAfterClose?: () => void;
  children: ReactNode;
}> = ({ isOpen, onClose, onAfterClose, children }) => {
  const [innerIsOpen, setInnerIsOpen] = useState(isOpen);
  const [startClose, setStartClose] = useState(false);
  const oldIsOpen = useRef(isOpen);

  const animation = useMemo(() => {
    if (startClose) {
      return "animate-fadeOut";
    }
    if (innerIsOpen) {
      return "animate-fadeIn";
    }
    return "";
  }, [innerIsOpen, startClose]);

  useEffect(() => {
    // true -> falseになったときに閉じるアニメーションを開始する
    if (oldIsOpen.current && !isOpen) {
      setStartClose(true);
    } else if (isOpen) {
      setInnerIsOpen(true);
    }
    oldIsOpen.current = isOpen;
  }, [isOpen]);

  const handleAnimationEnd = ({ animationName }: React.AnimationEvent) => {
    if (animationName === "fadeOut") {
      setInnerIsOpen(false);
      setStartClose(false);
      onAfterClose?.();
    }
  };

  return (
    <>
      {innerIsOpen && (
        <div
          className={`fixed top-0 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.5)]`}
          onAnimationEnd={handleAnimationEnd}
        >
          <div
            className={`${animation} relative flex h-80 w-80 flex-col items-center justify-center rounded-md bg-neutral-700 p-4 text-neutral-50`}
          >
            <button
              className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800 hover:bg-neutral-900"
              onClick={onClose}
            >
              <IoMdClose size={"70%"} />
            </button>

            {children}
          </div>
        </div>
      )}
    </>
  );
};
