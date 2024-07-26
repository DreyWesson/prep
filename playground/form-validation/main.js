import { toggleMenu } from "./form";
import "./style.css";

const app = document.querySelector("#app");
document.addEventListener("DOMContentLoaded", () => {
  app.innerHTML = `
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
            <li class="navbar-item"><a href="#">Home</a></li>
            <li class="navbar-item"><a href="#">About</a></li>
            <li class="navbar-item"><a href="#">Services</a></li>
            <li class="navbar-item"><a href="#">Contact</a></li>
        </ul>
    </nav>
    <form id="formData">
        <label for="email">Email:
          <input type="email" name="email" placeholder="Enter Your Email" id="email">
        </label>
        <div class="nameErrorContainer"></div>
        <label for="password">Password:
          <input name="password" type="password" placeholder="Enter Your Password" id="password">
        </label>
        <div class="passwordErrorContainer"></div>
        <span class="error" id="passwordError"></span>
        <button type="submit" class="btn" disabled>Submit</button>
    </form>
  `;
  toggleMenu(app);
});
