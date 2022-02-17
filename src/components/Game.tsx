import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { GameRow } from "./GameRow";
import { Header } from "./Header";
import { Keyboard } from "./Keyboard";
import { Modal } from "./Modal";

export const Game: React.FC = () => {
  const { gameState, resetInvalid, resetGame } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const count = 6;
  useKeyboardInput();

  const handleOpenResult = () => {
    setIsOpen(true);
  };

  const handleCloseResult = () => {
    setIsOpen(false);
  };

  const handleResetGame = () => {
    setIsReset(true);
    setIsOpen(false);
  };

  // ダイアログが閉じたあとにisResetフラグが立っていればゲームの状態をリセットする
  const handleAfterCloseDialog = () => {
    if (isReset) {
      resetGame();
      setIsReset(false);
    }
  };

  const handleAfterFlipout = () => {
    if (isEnd) {
      setIsOpen(true);
      setIsEnd(false);
    }
  };

  useEffect(() => {
    if (gameState.isEnd) {
      setIsEnd(true);
    }
  }, [gameState.isEnd]);

  return (
    <>
      <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-neutral-900">
        <Header gameState={gameState} onOpenResult={handleOpenResult} />
        <div className="flex flex-grow flex-col items-center justify-center">
          {[...new Array(count)].map((_, i) => {
            return (
              <GameRow
                key={i}
                rowData={gameState.history[i]}
                invalid={gameState.invalidRow === i}
                onResetInvalid={() => resetInvalid()}
                onAfterFlipOut={handleAfterFlipout}
              />
            );
          })}
        </div>
        <Keyboard className="mb-10" gameState={gameState} />
      </div>

      <Modal
        isOpen={gameState.isEnd && isOpen}
        onClose={handleCloseResult}
        onAfterClose={handleAfterCloseDialog}
      >
        <p className="mb-6 text-7xl font-bold">
          {gameState.isEnd && gameState.status.toUpperCase()}
        </p>
        <button
          className="rounded-md bg-green-600 py-2 px-4 text-xl font-bold"
          onClick={handleResetGame}
        >
          Restart
        </button>
      </Modal>
    </>
  );
};
