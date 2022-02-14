import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { GameRow } from "./GameRow";
import { Header } from "./Header";
import { Keyboard } from "./Keyboard";

export const Game: React.FC = () => {
  const { gameState, resetInvalid } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const count = 6;
  useKeyboardInput();

  useEffect(() => {
    if (gameState.isEnd) {
      setIsOpen(true);
    }
  }, [gameState.isEnd]);

  return (
    <>
      <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-neutral-900">
        <Header />
        {gameState.isEnd && (
          <button
            className="mt-5 rounded-md bg-neutral-600 px-3 py-1 text-stone-50 duration-150 hover:bg-stone-700 active:bg-stone-800"
            onClick={() => setIsOpen(true)}
          >
            Open Result
          </button>
        )}
        <div className="flex flex-grow flex-col items-center justify-center">
          {[...new Array(count)].map((_, i) => {
            return (
              <GameRow
                key={i}
                rowData={gameState.history[i]}
                invalid={gameState.invalidRow === i}
                onResetInvalid={() => resetInvalid()}
              />
            );
          })}
        </div>
        <Keyboard className="mb-10" gameState={gameState} />
      </div>
      <div>
        {gameState.isEnd && isOpen && (
          <div className="fixed top-0 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.5)] duration-150">
            <div className="h-80 w-80 rounded-md bg-neutral-700 p-4">
              <div className="h-full text-neutral-50">
                <div className="flex flex-row-reverse">
                  <button
                    className="h-8 w-8 bg-neutral-800"
                    onClick={() => setIsOpen(false)}
                  >
                    X
                  </button>
                </div>
                <div>{gameState.status}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
