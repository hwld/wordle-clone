import { useState } from "react";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { GameRow } from "./GameRow";

export const Game: React.FC = () => {
  const count = 6;
  const [words, setWords] = useState([...new Array(count)].map(() => ""));
  const [current, setCurrent] = useState(0);
  useKeyboardInput();

  const handleChangeWord = (word: string, index: number) => {
    if (word.length > 5) {
      return;
    }
    setWords((words) => {
      return words.map((w, i) => {
        if (i === index) {
          return word;
        }
        return w;
      });
    });
  };

  const handleNextRow = () => {
    setCurrent((c) => {
      if (c < count - 1) {
        return c + 1;
      }
      return c;
    });
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-neutral-900">
      {[...new Array(count)].map((_, i) => {
        return (
          <GameRow
            key={i}
            word={words[i]}
            row={i}
            currentRow={current}
            onChangeWord={handleChangeWord}
            onNextRow={handleNextRow}
          />
        );
      })}
    </div>
  );
};
