import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <a href="#">Brand</a>
        </div>
        <div className="navbar-toggle" id="mobile-menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className="navbar-menu" id="nav-links">
          <li className="navbar-item">
            <a href="#">Home</a>
          </li>
          <li className="navbar-item">
            <a href="#">About</a>
          </li>
          <li className="navbar-item">
            <a href="#">Services</a>
          </li>
          <li className="navbar-item">
            <a href="#">Contact</a>
          </li>
        </ul>
      </nav>
      <form id="formData">
        <label htmlFor="email">
          Email:
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            id="email"
          />
        </label>
        <div className="nameErrorContainer"></div>
        <label htmlFor="password">
          Password:
          <input
            name="password"
            type="password"
            placeholder="Enter Your Password"
            id="password"
          />
        </label>
        <div className="passwordErrorContainer"></div>
        <span className="error" id="passwordError"></span>
        <button type="submit" className="btn" disabled>
          Submit
        </button>
      </form>
    </>
  );
}

export default App;
