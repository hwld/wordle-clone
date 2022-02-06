import { eventmit, Eventmitter } from "eventmit";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type InputEvent = { key: string };

type InputContextValue = {
  inputEvent: Eventmitter<InputEvent>;
  input: (value: string) => void;
};

const InputContext = createContext<InputContextValue>({
  inputEvent: eventmit(),
  input: () => {},
});

export const InputContextProvider: React.VFC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [inputEvent] = useState(eventmit<InputEvent>());

  const input = useCallback((key: string) => {
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
