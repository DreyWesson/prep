import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [items, setItems] = useState<number[]>([1, 2, 3]);
  const addItem = () => {
    setItems([...items, items.length + 1]);
  };
  const handleClicked = (e: React.MouseEvent) => {
    console.log("clicked", e.target);
  };
  return (
    <>
      <ul id="parent-list" onClick={handleClicked}>
        {items.length > 0 && items.map((val, i) => <li key={i} className="child">{val}</li>)}
      </ul>
      <button id="add-item" onClick={addItem}>Add Item</button>
    </>
  );
}

export default App;
