// import "./App.css";
// import { Sidebar } from "./components/Sidebar";
// import { Headers } from "./components/Headers";
// import { Main } from "./components/Main";
// import { Route, Routes } from "react-router-dom";

// import Home from "./components/Home";
// import About from "./components/About";
// import Contact from "./components/Contact";
// import Login from "./components/Login";
// import PrivateRoute from "./components/private";

// function App() {
//   return (
//     <div className="dashboard">
//       <Sidebar />
//       <div className="main">
//         <Headers />
//         <Main rating={3.5} totalStars={5} />
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/" element={<PrivateRoute element={<Home />} />} />
//           <Route path="/about" element={<PrivateRoute element={<About />} />} />
//           <Route
//             path="/contact"
//             element={<PrivateRoute element={<Contact />} />}
//           />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;


import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { Headers } from "./components/Headers";
import { Main } from "./components/Main";
import { Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import PrivateRoute from "./components/private";


function App() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <Headers />
        <Main rating={3.5} totalStars={5} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute element={<Home />} />} />
          <Route path="/about" element={<PrivateRoute element={<About />} />} />
          <Route path="/contact" element={<PrivateRoute element={<Contact />} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

