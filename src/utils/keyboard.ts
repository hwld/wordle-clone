import { InputEvent } from "../contexts/InputContext";

export const KEYBOARD_LAYOUT: {
  first: InputEvent["key"][];
  second: InputEvent["key"][];
  third: InputEvent["key"][];
} = {
  first: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  second: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  third: ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
};
