import { GameTile } from "./GameTile";

type GameRowProps = {
  rowData: { word: string } & (
    | { isEnd: false }
    | { isEnd: true; hits: number[]; blows: number[] }
  );
  row: number;
  currentRow: number;
};

export const GameRow: React.VFC<GameRowProps> = ({
  rowData,
  row,
  currentRow,
}) => {
  const hitOrBlows = rowData.isEnd ? rowData.hits.concat(rowData.blows) : [];

  return (
    <div className="flex">
      {[...new Array(5)].map((_, i) => {
        return (
          <GameTile
            key={i}
            className={`m-1
              ${rowData.word[i] && "animate-pop"}
              ${rowData.isEnd && rowData.hits.includes(i) && "bg-green-600"}
              ${rowData.isEnd && rowData.blows.includes(i) && "bg-yellow-600"}
              ${rowData.isEnd && !hitOrBlows.includes(i) && "bg-neutral-500"}`}
          >
            {rowData.word[i]}
          </GameTile>
        );
      })}
    </div>
  );
};
