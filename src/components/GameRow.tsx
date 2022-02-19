import React, { useEffect, useRef, useState } from "react";
import { WORD_COUNT } from "../hooks/useGame";
import { replaceElement } from "../utils";
import { GameTile } from "./GameTile";

type GameRowProps = {
  rowData: { word: string } & (
    | { isEnd: false }
    | { isEnd: true; hits: number[]; blows: number[] }
  );
  invalid: boolean;
  onResetInvalid: () => void;
  onAfterFlipOut?: () => void;
};

export const GameRow: React.VFC<GameRowProps> = ({
  rowData,
  invalid,
  onResetInvalid,
  onAfterFlipOut = () => {},
}) => {
  const oldWordRef = useRef(rowData.word);
  const [rowAnimations, setRowAnimation] = useState("animate-none");
  const [tileAnimations, setTileAnimations] = useState(
    [...new Array(WORD_COUNT)].map(() => "animate-none")
  );
  const [tileStyles, setTileStyles] = useState(
    [...new Array(WORD_COUNT)].map(() => ({ css: "", border: true }))
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
    // 最後のタイルがflipOutしたらコールバックを呼び出す
    if (animationName === "flipOut" && index === WORD_COUNT - 1) {
      onAfterFlipOut();
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

  // 単語の入力が無効になったときにshakeアニメーションを実行する
  useEffect(() => {
    if (invalid) {
      shakeRow();
      onResetInvalid();
    }
  }, [invalid]);

  // 行データが確定したときにflipInアニメーションを実行
  // 行データがリセットされたときにスタイル情報のリセットを実行
  useEffect(() => {
    if (rowData.isEnd) {
      tileAnimations.forEach((_, i) => flipInTile(i));
    } else {
      // isEndがtrue->falseになるのは行データがリセットされたときなので、スタイルをリセットする
      setTileStyles((ss) =>
        ss.map(() => ({ css: "duration-200", border: true }))
      );
    }
  }, [rowData.isEnd]);

  return (
    <div
      className={`grid grid-cols-[repeat(5,1fr)] gap-1 ${rowAnimations}`}
      onAnimationEnd={handleRowAnimationEnd}
    >
      {[...new Array(5)].map((_, i) => {
        return (
          <GameTile
            key={i}
            className={`${tileAnimations[i]} ${tileStyles[i].css}`}
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
