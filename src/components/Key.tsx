import { useMemo } from "react";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { InputEvent } from "../contexts/InputContext";
import { assertNever } from "../utils";

export type KeyStatus = "hit" | "blow" | "absent" | "unknown";

export const Key: React.VFC<{
  className?: string;
  inputKey: InputEvent["key"];
  wide?: boolean;
  getKeyStatus: (key: InputEvent["key"]) => KeyStatus;
  onInputKey: (key: InputEvent["key"]) => void;
}> = ({ className, inputKey, wide = false, onInputKey, getKeyStatus }) => {
  const style = useMemo(() => {
    const status = getKeyStatus(inputKey);
    switch (status) {
      case "hit": {
        return "bg-green-600 hover:bg-green-700 active:bg-green-800";
      }
      case "blow": {
        return "bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800";
      }
      case "absent": {
        return "bg-transparent border border-stone-500 hover:border-stone-600 active:border-stone-700";
      }
      case "unknown": {
        return "bg-stone-600 hover:bg-stone-700 active:bg-stone-800";
      }
      default: {
        assertNever(status);
      }
    }
  }, [getKeyStatus, inputKey]);

  const content = useMemo(() => {
    if (inputKey === "Backspace") {
      return <RiDeleteBack2Fill size={"50%"}></RiDeleteBack2Fill>;
    }
    return inputKey;
  }, [inputKey]);

  const handleClick = () => {
    onInputKey(inputKey);
  };

  return (
    <button
      className={`flex h-16 text-neutral-100 ${
        wide ? "w-20" : "w-12"
      } select-none items-center justify-center rounded-[3px] text-lg font-bold duration-200 ${style} ${className}`}
      onClick={handleClick}
    >
      {content}
    </button>
  );
};
