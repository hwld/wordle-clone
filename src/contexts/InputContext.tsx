import { eventmit, Eventmitter } from "eventmit";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { isAlphabet } from "../types/alphabet";
import { Alphabet } from "../utils";

const OTHERS = ["Backspace", "Enter"] as const;
type Others = typeof OTHERS[number];
type InputKey = Alphabet | Others;
export const isInputKey = (value: unknown): value is InputKey => {
  return (
    typeof value === "string" &&
    (isAlphabet(value) || OTHERS.includes(value as Others))
  );
};

export type InputEvent = { key: InputKey };

type InputContextValue = {
  inputEvent: Eventmitter<InputEvent>;
  input: (value: InputKey) => void;
};

const InputContext = createContext<InputContextValue>({
  inputEvent: eventmit(),
  input: () => {},
});

export const InputContextProvider: React.VFC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [inputEvent] = useState(eventmit<InputEvent>());

  const input = useCallback((key: InputKey) => {
    inputEvent.emit({ key });
  }, []);

  const value = useMemo(() => {
    return { inputEvent, input };
  }, [inputEvent, input]);

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};

export const useInputContext = () => useContext(InputContext);
