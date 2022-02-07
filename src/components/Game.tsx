import { useEffect, useState } from "react";
import { InputEvent, useInputContext } from "../contexts/InputContext";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { isAlphabet } from "../types/alphabet";
import { GameRow } from "./GameRow";

export const Game: React.FC = () => {
  const count = 6;
  const { inputEvent } = useInputContext();
  useKeyboardInput();
  const [invalid, setInvalid] = useState(-1);
  const [history, setHistory] = useState<
    ({ word: string } & (
      | { isEnd: false }
      | { isEnd: true; hits: number[]; blows: number[] }
    ))[]
  >([...new Array(6)].map(() => ({ word: "", isEnd: false })));
  const [current, setCurrent] = useState(0);
  const answer = "AUDIO";

  useEffect(() => {
    const handleInput = ({ key }: InputEvent) => {
      setCurrent((current) => {
        if (key === "Backspace") {
          setHistory((history) => {
            return history.map((d, index) => {
              if (index === current) {
                return { ...d, word: d.word.slice(0, -1) };
              }
              return d;
            });
          });
        } else if (key === "Enter") {
          if (history[current].word.length === 5) {
            setHistory((history) => {
              return history.map((d, index) => {
                if (index === current) {
                  const hits = [];
                  const blows = [];
                  for (let i = 0; i < answer.length; i++) {
                    if (answer[i] === d.word[i]) {
                      hits.push(i);
                    }
                  }
                  for (let i = 0; i < answer.length; i++) {
                    if (!hits.includes(i) && answer.includes(d.word[i])) {
                      blows.push(i);
                    }
                  }

                  return { ...d, isEnd: true, hits, blows };
                }
                return d;
              });
            });
            return current + 1;
          } else {
            setInvalid(current);
          }
        } else if (isAlphabet(key)) {
          setHistory((history) => {
            return history.map((d, index) => {
              if (index === current) {
                return { ...d, word: d.word.concat(key.toUpperCase()) };
              }
              return d;
            });
          });
        }
        return current;
      });
    };

    inputEvent.on(handleInput);
    return () => {
      inputEvent.off(handleInput);
    };
  }, [history]);

  const handleAnimationEnd = ({ animationName }: React.AnimationEvent) => {
    if (animationName === "shake") {
      setInvalid(-1);
    }
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-neutral-900">
      {[...new Array(count)].map((_, i) => {
        return (
          <div
            className={`${invalid === i && "animate-shake"}`}
            onAnimationEnd={handleAnimationEnd}
          >
            <GameRow
              key={i}
              rowData={history[i]}
              row={i}
              currentRow={current}
            />
          </div>
        );
      })}
    </div>
  );
};
