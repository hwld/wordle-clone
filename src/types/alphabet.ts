const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;

export type Alphabet =
  | Lowercase<`${typeof alphabet[number]}`>
  | Uppercase<`${typeof alphabet[number]}`>;

export const isAlphabet = (value: unknown): value is Alphabet => {
  return typeof value === "string" && !!value.match(/^[a-zA-Z]$/);
};
