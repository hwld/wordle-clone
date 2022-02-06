import React from "react";
import { Game } from "./components/Game";
import { InputContextProvider } from "./contexts/InputContext";

function App() {
  return (
    <InputContextProvider>
      <Game />
    </InputContextProvider>
  );
}

export default App;
