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
        return "bg-green-700 hover:bg-green-600 active:bg-green-500";
      }
      case "blow": {
        return "bg-yellow-700 hover:bg-yellow-600 active:bg-yellow-500";
      }
      case "absent": {
        return "bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500";
      }
      case "unknown": {
        return "bg-stone-700 hover:bg-stone-600 active:bg-stone-500";
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
      } select-none items-center justify-center rounded-[3px] text-lg font-bold duration-150 ${style} ${className}`}
      onClick={handleClick}
    >
      {content}
    </button>
  );
};
