import { useEffect, useRef } from "react";
import { isInputKey, useInputContext } from "../contexts/InputContext";

export const useKeyboardInput = () => {
  const { input } = useInputContext();
  const pressedKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = ({ key }: KeyboardEvent) => {
      if (pressedKeys.current.has(key)) {
        return;
      }
      if (isInputKey(key)) {
        input(key);
      }
      pressedKeys.current.add(key);
    };
    const handleKeyUp = ({ key }: KeyboardEvent) => {
      pressedKeys.current.delete(key);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
};
