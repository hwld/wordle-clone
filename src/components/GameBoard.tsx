import { GameState } from "../hooks/useGame";
import { GameRow } from "./GameRow";

export const GameBoard: React.VFC<{
  gameState: GameState;
  onResetInvalid: () => void;
  onAfterFlipOut: () => void;
}> = ({ gameState, onResetInvalid, onAfterFlipOut }) => {
  return (
    <div className="grid h-[360px] w-full max-w-[300px] grid-rows-[repeat(6,1fr)] gap-1">
      {gameState.answers.map((_, i) => {
        return (
          <GameRow
            key={i}
            rowData={gameState.answers[i]}
            invalid={gameState.invalidAnswerIndex === i}
            onResetInvalid={onResetInvalid}
            onAfterFlipOut={onAfterFlipOut}
          />
        );
      })}
    </div>
  );
};
