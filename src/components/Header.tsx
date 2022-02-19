import { HiOutlineDocumentReport } from "react-icons/hi";
import { GameState } from "../hooks/useGame";

export const Header: React.VFC<{
  className?: string;
  gameState: GameState;
  onOpenResult: () => void;
}> = ({ gameState, onOpenResult }) => {
  const handleOpenResult = () => {
    onOpenResult();
  };

  return (
    <div className="h-12 w-full border-b border-stone-400 bg-neutral-800 text-neutral-100 2xl:h-16">
      <div className="m-auto flex h-full max-w-xl items-center justify-between">
        <div className="h-10 w-10"></div>
        <p className="select-none text-3xl font-bold 2xl:text-4xl">Wordleeee</p>
        <div className="h-10 w-10">
          {gameState.isGameEnd && (
            <button
              className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-700 text-stone-50 duration-150 hover:bg-stone-600 active:bg-stone-500"
              onClick={handleOpenResult}
            >
              <HiOutlineDocumentReport size={"70%"} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
