import React, { useEffect, useRef, useState } from "react";
import { replaceElement } from "../utils";
import { GameTile } from "./GameTile";

type GameRowProps = {
  rowData: { word: string } & (
    | { isEnd: false }
    | { isEnd: true; hits: number[]; blows: number[] }
  );
  invalid: boolean;
  onResetInvalid: () => void;
};

export const GameRow: React.VFC<GameRowProps> = ({
  rowData,
  invalid,
  onResetInvalid,
}) => {
  const oldWordRef = useRef(rowData.word);
  const [rowAnimations, setRowAnimation] = useState("animate-none");
  const [tileAnimations, setTileAnimations] = useState(
    [...new Array(5)].map(() => "animate-none")
  );
  const [tileStyles, setTileStyles] = useState(
    [...new Array(5)].map(() => ({ css: "", border: true }))
  );

  const popTile = (index: number) => {
    setTileAnimations(replaceElement(tileAnimations, index, "animate-pop"));
  };

  const shakeRow = () => {
    setRowAnimation("animate-shake");
  };

  const flipInTile = (index: number) => {
    setTimeout(
      () =>
        setTileAnimations((as) => replaceElement(as, index, "animate-flipIn")),
      100 * index
    );
  };

  const flipOutTile = (index: number) => {
    setTileAnimations((animations) =>
      replaceElement(animations, index, "animate-flipOut")
    );
    setTileStyles((colors) => {
      return replaceElement(colors, index, (c) => {
        if (!rowData.isEnd) {
          return c;
        }
        if (rowData.hits.includes(index)) {
          return { css: "bg-green-600", border: false };
        } else if (rowData.blows.includes(index)) {
          return { css: "bg-yellow-600", border: false };
        }
        return { css: "bg-neutral-600", border: false };
      });
    });
  };

  const resetTileAnimation = (index: number) => {
    setTileAnimations(replaceElement(tileAnimations, index, "animate-none"));
  };
  const resetRowAnimation = () => {
    setRowAnimation("animate-none");
  };

  const handleTileAnimationEnd = (
    { animationName }: React.AnimationEvent,
    index: number
  ) => {
    if (animationName === "flipIn") {
      flipOutTile(index);
      return;
    }
    resetTileAnimation(index);
  };

  const handleRowAnimationEnd = ({
    currentTarget,
    target,
  }: React.AnimationEvent) => {
    if (currentTarget === target) {
      resetRowAnimation();
    }
  };

  // 文字が入力されたときにpopアニメーションを実行する
  useEffect(() => {
    const oldWord = oldWordRef.current;
    const newWord = rowData.word;
    if (oldWord < newWord) {
      popTile(newWord.length - 1);
    }
    oldWordRef.current = rowData.word;
  }, [rowData.word]);

  // 単語の入力が無効だったときにshakeアニメーションを実行する
  useEffect(() => {
    if (invalid) {
      shakeRow();
      onResetInvalid();
    }
  }, [invalid]);

  // 単語の入力が有効だったときにflipInアニメーションを実行する
  useEffect(() => {
    if (rowData.isEnd) {
      tileAnimations.forEach((_, i) => flipInTile(i));
    } else {
      //行の情報がリセットされたときにはスタイルをリセットする
      setTileStyles((ss) => ss.map(() => ({ css: "", border: true })));
    }
  }, [rowData.isEnd]);

  return (
    <div
      className={`flex ${rowAnimations}`}
      onAnimationEnd={handleRowAnimationEnd}
    >
      {[...new Array(5)].map((_, i) => {
        return (
          <GameTile
            key={i}
            className={`m-0.5 ${tileAnimations[i]} ${tileStyles[i].css}`}
            border={tileStyles[i].border}
            onAnimationEnd={(e) => {
              handleTileAnimationEnd(e, i);
            }}
          >
            {rowData.word[i]}
          </GameTile>
        );
      })}
    </div>
  );
};
