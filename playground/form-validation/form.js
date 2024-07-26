export function toggleMenu(app) {
  const menuBar = app.querySelector("#mobile-menu");
  const navLink = app.querySelector("#nav-links");
  const emailInput = app.querySelector("#email");
  const passInput = app.querySelector("#password");
  const form = app.querySelector("#formData");
  const button = app.querySelector(".btn");

  const collection = [];
  let errors = {
    email: [],
    password: [],
  };
  let user = {
    email: "",
    password: "",
  };

  const handleToggle = () => {
    navLink.classList.toggle("active");
  };

  const handleBtn = (email, pass) => !(email.length > 0 && pass.length > 0);

  const handleInput = (e) => {
    e.stopPropagation();

    user = {
      ...user,
      [e.target.name]: e.target.value.trim(),
    };

    button.disabled = handleBtn(user.email, user.password);
  };

  const updateError = (errors, name, msg) => {
    if (!errors[name].includes(msg)) {
      return {
        ...errors,
        [name]: [...errors[name], msg],
      };
    }
    return errors;
  };

  const renderError = (err, container) => {
    const errorContainer = document.querySelector(container);
    errorContainer.innerHTML = "";
    for (let i = 0; i < err.length; i++) {
      const span = document.createElement("span");
      span.classList.add("error");
      span.textContent = err[i];
      errorContainer.appendChild(span);
    }
  };
  const handleEmailValidation = (value, name) => {
    errors[name] = [];
    if (!value.includes("@")) {
      errors = updateError(errors, name, "Enter valid email");
    }

    if (value.length < 3) {
      errors = updateError(errors, name, "Too short");
    }
    if (errors[name].length > 0) {
      renderError(errors[name], ".nameErrorContainer");
    }
  };

  const handlePasswordValidation = (value, name) => {
    const alphaSet = "qwertyuiopasdfghjklzxcvbnm";
    const numSet = "1234567890";
    const specialSet = " !@#$%^&*()><?:;";

    let hasAlpha = false;
    let hasNum = false;
    let hasSpecial = false;

    for (let char of value) {
      if (alphaSet.includes(char) || alphaSet.toUpperCase().includes(char))
        hasAlpha = true;
      else if (numSet.includes(char)) hasNum = true;
      else if (specialSet.includes(char)) hasSpecial = true;
    }

    if (!hasAlpha)
      errors = updateError(errors, name, "Password should include alphabets");

    if (!hasNum)
      errors = updateError(errors, name, "Password should include numerics");

    if (!hasSpecial)
      errors = updateError(errors, name, "Password should include special");

    if (value.length < 3 && !errors.password.includes("Too short"))
      errors = updateError(errors, name, "Too short");

    if (errors[name].length > 0)
      renderError(errors[name], ".passwordErrorContainer");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    handleEmailValidation(user.email, "email");
    handlePasswordValidation(user.password, "password");
    if (errors.email.length > 0 || errors.password.length > 0) {
      if (errors.email.length > 0) {
        emailInput.value = "";
      }
      if (errors.password.length > 0) {
        passInput.value = "";
      }
    } else {
      collection.push(user);
      console.log("Form Submitted Successfully!!!");
      renderError(errors["email"], ".passwordErrorContainer");
      renderError(errors["password"], ".passwordErrorContainer");
      emailInput.value = "";
      passInput.value = "";
    }
    errors = {
      email: [],
      password: [],
    };
  };

  menuBar.addEventListener("click", handleToggle);
  emailInput.addEventListener("input", handleInput);
  passInput.addEventListener("input", handleInput);
  form.addEventListener("submit", handleSubmit);
}
