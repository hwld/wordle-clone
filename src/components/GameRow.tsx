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
  const [animations, setAnimations] = useState(
    [...new Array(5)].map(() => "animate-none")
  );
  const [styles, setStyles] = useState(
    [...new Array(5)].map(() => ({ css: "", border: true }))
  );

  const popTile = (index: number) => {
    setAnimations(replaceElement(animations, index, "animate-pop"));
  };

  const shakeRow = () => {
    setRowAnimation("animate-shake");
  };

  const flipIn = (index: number) => {
    setTimeout(
      () => setAnimations((as) => replaceElement(as, index, "animate-flipIn")),
      100 * index
    );
  };

  const flipOut = (index: number) => {
    setAnimations((animations) =>
      replaceElement(animations, index, "animate-flipOut")
    );
    setStyles((colors) => {
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

  const resetAnimation = (index: number) => {
    setAnimations(replaceElement(animations, index, "animate-none"));
  };
  const resetRowAnimation = () => {
    setRowAnimation("animate-none");
  };

  // 文字が入力されたときにpopアニメーションを実行する
  useEffect(() => {
    const oldWord = oldWordRef.current;
    const newWord = rowData.word;
    console.log("effect");
    if (oldWord < newWord) {
      console.log("if");
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
      animations.forEach((_, i) => flipIn(i));
    }
  }, [rowData.isEnd]);

  const handleAnimationEnd = (
    { animationName }: React.AnimationEvent,
    index: number
  ) => {
    if (animationName === "flipIn") {
      flipOut(index);
      return;
    }
    resetAnimation(index);
  };

  const handleRowAnimationEnd = ({
    currentTarget,
    target,
  }: React.AnimationEvent) => {
    if (currentTarget === target) {
      resetRowAnimation();
    }
  };

  return (
    <div
      className={`flex ${rowAnimations}`}
      onAnimationEnd={handleRowAnimationEnd}
    >
      {[...new Array(5)].map((_, i) => {
        return (
          <GameTile
            key={i}
            className={`m-1 ${animations[i]} ${styles[i].css}`}
            border={styles[i].border}
            onAnimationEnd={(e) => {
              handleAnimationEnd(e, i);
            }}
          >
            {rowData.word[i]}
          </GameTile>
        );
      })}
    </div>
  );
};
