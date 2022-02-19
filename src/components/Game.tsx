import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { GameBoard } from "./GameBoard";
import { Header } from "./Header";
import { Keyboard } from "./Keyboard";
import { ResultDialog } from "./ResultDialog";

export const Game: React.FC = () => {
  const { gameState, resetInvalid, resetGame } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
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
    if (gameState.isGameEnd) {
      setIsEnd(true);
    }
  }, [gameState.isGameEnd]);

  return (
    <div className="font-Righteous flex h-screen w-screen flex-col items-center justify-between bg-neutral-900">
      <Header gameState={gameState} onOpenResult={handleOpenResult} />
      <GameBoard
        gameState={gameState}
        onResetInvalid={() => resetInvalid()}
        onAfterFlipOut={handleAfterFlipout}
      />
      <Keyboard className="mb-1 flex-shrink-0" gameState={gameState} />

      <ResultDialog
        gameState={gameState}
        isOpen={isOpen}
        onClose={handleCloseResult}
        onAfterClose={handleAfterCloseDialog}
        onResetGame={handleResetGame}
      />
    </div>
  );
};
