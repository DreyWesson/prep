import logo from "./logo.svg";
import "./App.css";
import useForm from "./useForm";

function App() {
  const {
    items,
    handleInputChange,
    handleSubmit,
    handleUpdate,
    handleDelete,
    formData,
  } = useForm();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </header>
      <form style={{ padding: "10px", minWidth: "400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="Add ID"
            value={formData.id}
            onChange={handleInputChange}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            placeholder="Add item"
            value={formData.itemName}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" onClick={handleSubmit} style={{margin:"5px"}}>
          Add Item
        </button>
        <button type="button" onClick={handleUpdate} style={{margin:"5px"}}>
          Update Item
        </button>
        <button type="button" onClick={handleDelete} style={{margin:"5px"}}>
          Delete Item
        </button>
      </form>
    </div>
  );
}

export default App;
