import { GameState } from "../hooks/useGame";

export const Header: React.VFC<{
  gameState: GameState;
  onOpenResult: () => void;
}> = ({ gameState, onOpenResult }) => {
  const handleOpenResult = () => {
    console.log("a");
    onOpenResult();
  };

  return (
    <div className="flex h-16 w-full items-center justify-between bg-neutral-800 text-neutral-100">
      <div></div>
      <p className="select-none text-xl font-bold">Wordle Clone</p>
      <div></div>
      <div className="absolute right-4">
        {gameState.isEnd && (
          <button
            className="rounded-md bg-neutral-600 px-3 py-1 text-stone-50 duration-150 hover:bg-stone-700 active:bg-stone-800"
            onClick={handleOpenResult}
          >
            Open Result
          </button>
        )}
      </div>
    </div>
  );
};
