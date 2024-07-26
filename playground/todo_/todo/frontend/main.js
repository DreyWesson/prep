import './style.css'
// import { Todo } from './todo.class.js';
import { todo } from './todo.func.js';
import { ui } from './ui.js';



const app = document.querySelector('#app');
document.addEventListener("DOMContentLoaded", () => {
    app.innerHTML = ui;
    // new Todo(app)
    todo(app);
})
