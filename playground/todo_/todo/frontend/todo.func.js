export const todo = (app) => {
  const todoInput = app.querySelector("#todo-input");
  const searchIcon = app.querySelector("#search-todo");
  const addBtn = app.querySelector("#add-todo");
  const filterField = app.querySelector("#filter-input");
  const listTodo = app.querySelector("#todo-list");
  let todoList = [];

  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
  });
  searchIcon.addEventListener("click", searchTodo);
  filterField.addEventListener("change", filterTodo);

  function addTodo() {
    const text = todoInput.value.trim();
    if (text === "") return;

    const todo = {
      text,
      id: Date.now(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    todoList.push(todo);
    renderTodo(todoList);
    todoInput.value = "";
  }

  function filterTodo() {
    let filteredTodos;
    if (filterField.value === "active") {
      filteredTodos = todoList.filter((todo) => !todo.completed);
    } else if (filterField.value === "completed") {
      filteredTodos = todoList.filter((todo) => todo.completed);
    } else {
      filteredTodos = todoList;
    }

    renderTodo(filteredTodos);
  }

  function searchTodo() {
    const input = todoInput.value.trim().toLowerCase();
    const searched = todoList.filter((todo) =>
      todo.text.toLowerCase().includes(input)
    );
    renderTodo(searched);
  }

  function deleteTodo(id) {
    todoList = todoList.filter((todo) => todo.id !== id);
    renderTodo(todoList);
  }

  function toggleComplete(id) {
    todoList = todoList.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    renderTodo(todoList);
  }

  function updateTodo(id) {
    const text = prompt("Update your todo");
    if (text) {
      todoList = todoList.map((todo) => {
        if (todo.id === id) {
          todo.text = text;
          todo.updatedAt = new Date();
        }
        return todo;
      });
      renderTodo(todoList);
    }
  }

  function createCheckbox(className, completed, cb, id) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add(className);
    checkbox.checked = completed;
    checkbox.addEventListener("change", () => cb(id));
    return checkbox
  }
  const createSpan = (className, text) => {
    const span = document.createElement("span");
    span.classList.add(className);
    span.textContent = text;
    return span;
  }

  const createBtn = (text, className, cb) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.classList.add(className);
    btn.addEventListener("click", cb);
    return btn;
  }

  function renderTodo(todoArr) {
    listTodo.innerHTML = "";
    todoArr.forEach((todo) => {
      const li = document.createElement("li");
      li.classList.toggle("completed", todo.completed);

      const checkbox = createCheckbox("checkbox", todo.completed, toggleComplete, todo.id);
      const text = createSpan("todo-text", todo.text);

      const editBtn = createBtn("Edit", "edit-btn", (e) => {
        e.stopPropagation();
        updateTodo(todo.id);
      })

      const deleteBtn = createBtn("Delete", "delete-btn", (e) => {
        e.stopPropagation();
        deleteTodo(todo.id);
      })

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      listTodo.appendChild(li);
    });
  }
};
