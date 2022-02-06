import { useEffect } from "react";
import { InputEvent, useInputContext } from "../contexts/InputContext";
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

  useEffect(() => {
    const handleInput = ({ key }: InputEvent) => {
      if (currentRow !== row) {
        return;
      }

      if (key === "Backspace") {
        onChangeWord(word.slice(0, -1), row);
      } else if (key === "Enter") {
        onNextRow();
      } else if (key.match(/^[a-zA-Z]$/)) {
        onChangeWord(word.concat(key.toUpperCase()), row);
      }
    };

    inputEvent.on(handleInput);
    return () => {
      inputEvent.off(handleInput);
    };
  }, [word, currentRow]);

  return (
    <div className="flex">
      {[...new Array(5)].map((_, i) => {
        return <GameTile className="m-1">{word[i]}</GameTile>;
      })}
    </div>
  );
};
