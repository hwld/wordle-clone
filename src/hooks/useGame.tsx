import { Reducer, useEffect, useReducer } from "react";
import { InputEvent, useInputContext } from "../contexts/InputContext";
import { isAlphabet } from "../types/alphabet";
import { assertNever, replaceElement } from "../utils";

export type GameRowData = { word: string } & (
  | { isEnd: false }
  | { isEnd: true; hits: number[]; blows: number[]; absents: number[] }
);
export type GameState = {
  history: GameRowData[];
  currentRow: number;
  invalidRow: number;
  answer: string;
} & ({ isEnd: false } | { isEnd: true; status: "win" | "lose" });
type GameAction =
  | { type: "enter"; key: InputEvent["key"] }
  | { type: "resetInvalid" }
  | { type: "resetGame"; newAnswer: string };

const reducer: Reducer<GameState, GameAction> = (state, action) => {
  if (state.currentRow >= state.history.length) {
    return state;
  }
  const currentRow = state.history[state.currentRow];

  switch (action.type) {
    case "enter": {
      if (isAlphabet(action.key)) {
        if (currentRow.word.length >= 5) {
          return state;
        }
        const newState: GameState = {
          ...state,
          history: replaceElement(state.history, state.currentRow, (row) => ({
            ...row,
            word: row.word.concat(action.key.toUpperCase()),
          })),
        };
        return newState;
      } else if (action.key === "Enter") {
        if (currentRow.word.length < 5 /* ||　リストにない単語 */) {
          return { ...state, invalidRow: state.currentRow };
        }
        // TODO: 同じ文字があった場合にうまく行かない
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

        const absents: number[] = [];
        for (let i = 0; i < currentRow.word.length; i++) {
          if (!hits.includes(i) && !blows.includes(i)) {
            absents.push(i);
          }
        }

        const newState: GameState = {
          ...state,
          history: replaceElement(state.history, state.currentRow, (row) => ({
            ...row,
            isEnd: true,
            hits,
            blows,
            absents,
          })),
          currentRow: state.currentRow + 1,
          answer: state.answer,
        };

        if (state.answer.length === hits.length) {
          return { ...newState, isEnd: true, status: "win" };
        } else if (state.currentRow === state.history.length - 1) {
          return { ...newState, isEnd: true, status: "lose" };
        } else {
          return newState;
        }
      } else if (action.key === "Backspace") {
        const newState: GameState = {
          ...state,
          history: replaceElement(state.history, state.currentRow, (row) => ({
            ...row,
            word: row.word.slice(0, -1),
          })),
        };
        return newState;
      }
    }
    case "resetInvalid": {
      return { ...state, invalidRow: -1 };
    }
    case "resetGame": {
      return state;
    }
    default: {
      return assertNever(action);
    }
  }
};

export const useGame = () => {
  const [gameState, dispatch] = useReducer(reducer, {
    history: [...new Array(6)].map(() => ({ word: "", isEnd: false as const })),
    currentRow: 0,
    invalidRow: -1,
    answer: "AUDIO",
    isEnd: false,
  });
  const { inputEvent } = useInputContext();

  const enterKey = (key: InputEvent["key"]) => {
    dispatch({ type: "enter", key });
  };

  const resetInvalid = () => {
    dispatch({ type: "resetInvalid" });
  };

  useEffect(() => {
    const handleInput = ({ key }: InputEvent) => {
      enterKey(key);
    };

    inputEvent.on(handleInput);
    return () => {
      inputEvent.off(handleInput);
    };
  }, []);

  return { gameState, dispatch, enterKey, resetInvalid };
};
