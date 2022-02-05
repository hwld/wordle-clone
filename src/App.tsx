import { useEffect, useState } from "react";

function App() {
  const [char, setChar] = useState("A");

  useEffect(() => {
    window.addEventListener("keydown", ({ key }: KeyboardEvent) => {
      if (key.match(/^[a-z]$/)) {
        setChar(key.toUpperCase());
      }
    });
  }, []);

  return (
    <div className="min-h-screen w-screen bg-slate-800 flex justify-center items-center">
      <div className="w-16 h-16  border-2 border-stone-500 flex text-stone-50 justify-center items-center font-bold text-3xl pb-1">
        {char}
      </div>
    </div>
  );
}

export default App;
