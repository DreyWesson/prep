import React from "react";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <nav>
      <div>Logo</div>
      <ul>
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-solid fa-users"></i>
            <span>Users</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-solid fa-gear"></i>
            <span>Settings</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>Login</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

{
  /* <NavLink
to="/about"
className={({ isActive }) => (isActive ? "active" : "")}
>
About
</NavLink>
<NavLink
to="/contact"
className={({ isActive }) => (isActive ? "active" : "")}
>
Contact
</NavLink>
<NavLink
to="/login"
className={({ isActive }) => (isActive ? "active" : "")}
>
Login
</NavLink> */
}
