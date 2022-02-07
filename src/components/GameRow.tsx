import { useEffect, useState } from "react";
import { InputEvent, useInputContext } from "../contexts/InputContext";
import { isAlphabet } from "../types/alphabet";
import { GameTile } from "./GameTile";

type GameRowProps = {
  word: string;
  row: number;
  currentRow: number;
  onChangeWord: (word: string, index: number) => void;
  onNextRow: () => void;
};

export const GameRow: React.VFC<GameRowProps> = ({
  word,
  row,
  currentRow,
  onChangeWord,
  onNextRow,
}) => {
  const { inputEvent } = useInputContext();
  const [miss, setMiss] = useState(false);

  useEffect(() => {
    const handleInput = ({ key }: InputEvent) => {
      if (currentRow !== row) {
        return;
      }

      if (key === "Backspace") {
        onChangeWord(word.slice(0, -1), row);
      } else if (key === "Enter") {
        if (word.length === 5) {
          onNextRow();
        } else {
          setMiss(true);
        }
      } else if (isAlphabet(key)) {
        onChangeWord(word.concat(key.toUpperCase()), row);
      }
    };

    inputEvent.on(handleInput);
    return () => {
      inputEvent.off(handleInput);
    };
  }, [word, currentRow]);

  const handleAnimationEnd = ({ animationName }: React.AnimationEvent) => {
    if (animationName === "shake") {
      setMiss(false);
    }
  };

  return (
    <div className="flex">
      {[...new Array(5)].map((_, i) => {
        return (
          <div
            className={`${miss && "animate-shake"}`}
            onAnimationEnd={handleAnimationEnd}
          >
            <GameTile
              key={i}
              className={`m-1
              ${word[i] && "animate-pop"}`}
            >
              {word[i]}
            </GameTile>
          </div>
        );
      })}
    </div>
  );
};
