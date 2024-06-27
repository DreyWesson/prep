import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { useGlobalState } from "./StateProvider";
import { addItem, deleteItem, getItems, updateItem } from "./apis";

function App() {
  const [{ items }, dispatch] = useGlobalState();

  const [formData, setFormData] = useState({ id: "", itemName: "" });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsData = await getItems();
        dispatch({ type: "SET_ITEMS", items: itemsData.data });
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [dispatch]);

  useEffect(() => console.log("Here: ", items), [items]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "id" && value !== "") {
      value = parseInt(value);
    }
    console.log({ name, value });
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, itemName } = formData;
    if (!id || !itemName) {
      alert("Please enter both ID and Item Name.");
      return;
    }
    const item = await addItem({ id, name: itemName });
    console.log({ item });
    dispatch({ type: "ADD_ITEM", item: item.data });

    setFormData({ id: "", itemName: "" });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { id, itemName } = formData;
    if (!id || !itemName) {
      alert("Please enter both ID and Item Name.");
      return;
    }
    const item = await updateItem({ id, name: itemName });
    dispatch({ type: "UPDATE_ITEM", item });
    setFormData({ id: "", itemName: "" });
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    const { id } = formData;
    if (!id) {
      alert("Please enter both ID and Item Name.");
      return;
    }
    const res = await deleteItem(id );
    console.log({ res });
    // if (res.message === "Item deleted successfully")
      dispatch({ type: "DELETE_ITEM", item: formData });
    setFormData({ id: "", itemName: "" });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </header>
      <form style={{ padding: "10px" }}>
        <label htmlFor="id">
          ID:
          <input
            type="text"
            id="id"
            name="id"
            placeholder="Add ID"
            value={formData.id}
            onChange={handleInputChange}
          />
        </label>
        <label htmlFor="itemName">
          Item Name:
          <input
            type="text"
            id="itemName"
            name="itemName"
            placeholder="Add item"
            value={formData.itemName}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit" onClick={handleSubmit}>
          Add Item
        </button>
        <button type="button" onClick={handleUpdate}>
          Update Item
        </button>
        <button type="button" onClick={handleDelete}>Delete Item</button>
      </form>
    </div>
  );
}

export default App;
