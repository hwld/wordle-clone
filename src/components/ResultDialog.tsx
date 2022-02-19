import { GameState } from "../hooks/useGame";
import { Modal } from "./Modal";

export const ResultDialog: React.VFC<{
  gameState: GameState;
  isOpen: boolean;
  onClose: () => void;
  onAfterClose: () => void;
  onResetGame: () => void;
}> = ({ gameState, isOpen, onClose, onAfterClose, onResetGame }) => {
  return (
    <Modal
      isOpen={gameState.isGameEnd && isOpen}
      onClose={onClose}
      onAfterClose={onAfterClose}
    >
      <p className="mb-6 text-7xl font-bold">
        {gameState.isGameEnd && gameState.status.toUpperCase()}
      </p>
      <button
        className="rounded-md bg-green-600 py-2 px-4 text-xl font-bold"
        onClick={onResetGame}
      >
        Restart
      </button>
    </Modal>
  );
};
