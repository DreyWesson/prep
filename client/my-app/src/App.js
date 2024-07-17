import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">z
        <nav class="navbar">
          <div class="navbar-brand">
            <a href="#">Brand</a>
          </div>
          <div class="navbar-toggle" id="mobile-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
          <ul class="navbar-menu" id="nav-links">
            <li class="navbar-item">
              <a href="#">Home</a>
            </li>
            <li class="navbar-item">
              <a href="#">About</a>
            </li>
            <li class="navbar-item">
              <a href="#">Services</a>
            </li>
            <li class="navbar-item">
              <a href="#">Contact</a>
            </li>
          </ul>
        </nav>
        {/* <img src={logo} className="App-logo" alt="logo" />
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
        </a> */}
      </header>
    </div>
  );
}

export default App;
