import { Reducer, useEffect, useReducer } from "react";
import { InputEvent, useInputContext } from "../contexts/InputContext";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { Alphabet, isAlphabet } from "../types/alphabet";
import { assertNever, replaceElement } from "../utils";
import { GameRow } from "./GameRow";

export type GameRowData = { word: string } & (
  | { isEnd: false }
  | { isEnd: true; hits: number[]; blows: number[] }
);
type State = {
  history: GameRowData[];
  currentRow: number;
  invalidRow: number;
  answer: string;
};
type Action =
  | { type: "backspace" }
  | { type: "enter" }
  | { type: "input"; key: Alphabet }
  | { type: "resetInvalid" };

const reducer: Reducer<State, Action> = (state, action) => {
  const currentRow = state.history[state.currentRow];

  switch (action.type) {
    case "input": {
      if (currentRow.word.length >= 5) {
        return state;
      }

      const newState: State = {
        ...state,
        history: replaceElement(state.history, state.currentRow, (row) => ({
          ...row,
          word: row.word.concat(action.key.toUpperCase()),
        })),
      };
      return newState;
    }
    case "backspace": {
      const newState: State = {
        ...state,
        history: replaceElement(state.history, state.currentRow, (row) => ({
          ...row,
          word: row.word.slice(0, -1),
        })),
      };
      return newState;
    }
    case "enter": {
      if (currentRow.word.length < 5 /* ||　リストにない単語 */) {
        return { ...state, invalidRow: state.currentRow };
      }
      const hits: number[] = [];
      for (let i = 0; i < state.answer.length; i++) {
        if (state.answer[i] === currentRow.word[i]) {
          hits.push(i);
        }
      }
      const blows: number[] = [];
      for (let i = 0; i < state.answer.length; i++) {
        if (!hits.includes(i) && state.answer.includes(currentRow.word[i])) {
          blows.push(i);
        }
      }

      const newState: State = {
        ...state,
        history: replaceElement(state.history, state.currentRow, (row) => ({
          ...row,
          isEnd: true,
          hits,
          blows,
        })),
        currentRow: state.currentRow + 1,
        answer: state.answer,
      };

      return newState;
    }
    case "resetInvalid": {
      return { ...state, invalidRow: -1 };
    }
    default: {
      return assertNever(action);
    }
  }
};

export const Game: React.FC = () => {
  const [gameLog, dispatch] = useReducer(reducer, {
    history: [...new Array(6)].map(() => ({ word: "", isEnd: false as const })),
    currentRow: 0,
    invalidRow: -1,
    answer: "AUDIO",
  });
  const count = 6;
  const { inputEvent } = useInputContext();
  useKeyboardInput();

  useEffect(() => {
    const handleInput = ({ key }: InputEvent) => {
      if (key === "Backspace") {
        dispatch({ type: "backspace" });
      } else if (key === "Enter") {
        dispatch({ type: "enter" });
      } else if (isAlphabet(key)) {
        dispatch({ type: "input", key });
      }
    };

    inputEvent.on(handleInput);
    return () => {
      inputEvent.off(handleInput);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-neutral-900">
      {[...new Array(count)].map((_, i) => {
        return (
          <GameRow
            key={i}
            rowData={gameLog.history[i]}
            invalid={gameLog.invalidRow === i}
            onResetInvalid={() => dispatch({ type: "resetInvalid" })}
          />
        );
      })}
    </div>
  );
};
