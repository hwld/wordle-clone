import { Reducer, useEffect, useReducer } from "react";
import { InputEvent, useInputContext } from "../contexts/InputContext";
import { isAlphabet } from "../types/alphabet";
import { assertNever, replaceElement } from "../utils";
import { getRandomWord, includeInWords } from "../utils/words";

export const LIMIT = 6;
export const WORD_COUNT = 5;

export type Answer = { word: string } & (
  | { isEnd: false }
  | { isEnd: true; hits: number[]; blows: number[]; absents: number[] }
);
export type GameState = {
  answers: Answer[];
  currentAnswerIndex: number;
  invalidAnswerIndex: number;
  correctAnswer: string;
} & ({ isGameEnd: false } | { isGameEnd: true; status: "win" | "lose" });
type GameAction =
  | { type: "enter"; key: InputEvent["key"] }
  | { type: "resetInvalid" }
  | { type: "resetGame" };

const reducer: Reducer<GameState, GameAction> = (state, action) => {
  switch (action.type) {
    case "enter": {
      if (state.currentAnswerIndex >= state.answers.length || state.isGameEnd) {
        return state;
      }
      const currentAnswer = state.answers[state.currentAnswerIndex];

      if (isAlphabet(action.key)) {
        if (currentAnswer.word.length >= WORD_COUNT) {
          return state;
        }
        const newState: GameState = {
          ...state,
          answers: replaceElement(
            state.answers,
            state.currentAnswerIndex,
            (row) => ({
              ...row,
              word: row.word.concat(action.key.toUpperCase()),
            })
          ),
        };
        return newState;
      } else if (action.key === "Enter") {
        if (
          currentAnswer.word.length < WORD_COUNT ||
          !includeInWords(currentAnswer.word)
        ) {
          return { ...state, invalidAnswerIndex: state.currentAnswerIndex };
        }
        // TODO: 同じ文字があった場合にうまく行かない
        const hits: number[] = [];
        for (let i = 0; i < state.correctAnswer.length; i++) {
          if (state.correctAnswer[i] === currentAnswer.word[i]) {
            hits.push(i);
          }
        }
        const blows: number[] = [];
        for (let i = 0; i < state.correctAnswer.length; i++) {
          if (
            !hits.includes(i) &&
            state.correctAnswer.includes(currentAnswer.word[i])
          ) {
            blows.push(i);
          }
        }

        const absents: number[] = [];
        for (let i = 0; i < currentAnswer.word.length; i++) {
          if (!hits.includes(i) && !blows.includes(i)) {
            absents.push(i);
          }
        }

        const newState: GameState = {
          ...state,
          answers: replaceElement(
            state.answers,
            state.currentAnswerIndex,
            (row) => ({
              ...row,
              isEnd: true,
              hits,
              blows,
              absents,
            })
          ),
          currentAnswerIndex: state.currentAnswerIndex + 1,
          correctAnswer: state.correctAnswer,
        };

        if (state.correctAnswer.length === hits.length) {
          return { ...newState, isGameEnd: true, status: "win" };
        } else if (state.currentAnswerIndex === state.answers.length - 1) {
          return { ...newState, isGameEnd: true, status: "lose" };
        } else {
          return newState;
        }
      } else if (action.key === "Backspace") {
        const newState: GameState = {
          ...state,
          answers: replaceElement(
            state.answers,
            state.currentAnswerIndex,
            (row) => ({
              ...row,
              word: row.word.slice(0, -1),
            })
          ),
        };
        return newState;
      }
    }
    case "resetInvalid": {
      return { ...state, invalidAnswerIndex: -1 };
    }
    case "resetGame": {
      return initialState();
    }
    default: {
      return assertNever(action);
    }
  }
};

const initialState = (): GameState => {
  return {
    answers: [...new Array(LIMIT)].map(() => ({
      word: "",
      isEnd: false as const,
    })),
    currentAnswerIndex: 0,
    invalidAnswerIndex: -1,
    correctAnswer: getRandomWord(),
    isGameEnd: false,
  };
};

export const useGame = () => {
  const [gameState, dispatch] = useReducer(reducer, initialState());
  const { inputEvent } = useInputContext();
  console.log(gameState.correctAnswer);

  const enterKey = (key: InputEvent["key"]) => {
    dispatch({ type: "enter", key });
  };

  const resetInvalid = () => {
    dispatch({ type: "resetInvalid" });
  };

  const resetGame = () => {
    dispatch({ type: "resetGame" });
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

  return { gameState, dispatch, enterKey, resetInvalid, resetGame };
};
