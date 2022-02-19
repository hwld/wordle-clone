import { ReactNode, useCallback } from "react";
import { InputEvent, useInputContext } from "../contexts/InputContext";
import { GameState } from "../hooks/useGame";
import { isAlphabet } from "../types/alphabet";
import { KEYBOARD_LAYOUT } from "../utils/keyboard";
import { Key, KeyStatus } from "./Key";

const KeyRow: React.VFC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={`mb-2 flex w-full justify-center gap-2 ${className}`}>
      {children}
    </div>
  );
};

export const Keyboard: React.VFC<{
  className?: string;
  gameState: GameState;
}> = ({ className, gameState }) => {
  const { input } = useInputContext();
  const handleInputKey = (key: InputEvent["key"]) => {
    input(key);
  };

  const getKeyStatus = useCallback(
    (key: InputEvent["key"]): KeyStatus => {
      const hits: string[] = [];
      const blows: string[] = [];
      const absents: string[] = [];
      for (let h of gameState.answers) {
        if (h.isEnd) {
          hits.push(...h.hits.map((i) => h.word[i]));
          blows.push(...h.blows.map((i) => h.word[i]));
          absents.push(...h.absents.map((i) => h.word[i]));
        }
      }
      if (hits.includes(key)) {
        return "hit";
      } else if (blows.includes(key)) {
        return "blow";
      } else if (absents.includes(key)) {
        return "absent";
      } else {
        return "unknown";
      }
    },
    [gameState.answers]
  );

  return (
    <div className={`w-full max-w-[500px] ${className}`}>
      <KeyRow>
        {KEYBOARD_LAYOUT.first.map((key, i) => {
          return (
            <Key
              key={i}
              inputKey={key}
              onInputKey={handleInputKey}
              getKeyStatus={getKeyStatus}
            />
          );
        })}
      </KeyRow>
      <KeyRow className="px-7">
        {KEYBOARD_LAYOUT.second.map((key, i) => {
          return (
            <Key
              key={i}
              inputKey={key}
              onInputKey={handleInputKey}
              getKeyStatus={getKeyStatus}
            />
          );
        })}
      </KeyRow>
      <KeyRow>
        {KEYBOARD_LAYOUT.third.map((key, i) => {
          let wide = false;
          if (!isAlphabet(key)) {
            wide = true;
          }
          return (
            <Key
              key={i}
              inputKey={key}
              onInputKey={handleInputKey}
              wide={wide}
              getKeyStatus={getKeyStatus}
            ></Key>
          );
        })}
      </KeyRow>
    </div>
  );
};
