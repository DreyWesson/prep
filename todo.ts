import { ITodo, IElement, IRender } from "./testground/todo_ts/src/interfaces";

// Get all required elements from the DOM
const getAllElements = (app: HTMLElement): IElement => {
  return {
    todoInput: app.querySelector("#todo-input")!,
    searchIcon: app.querySelector("#search-todo")!,
    addBtn: app.querySelector("#add-todo")!,
    filterField: app.querySelector("#filter-input")!,
    listTodo: app.querySelector("#todo-list")!,
  };
};

// Create an input checkbox element
const createCheckbox = (
  todo: ITodo,
  classNames: string,
  type: string,
  onChange: (event: Event) => void
): HTMLInputElement => {
  const checkbox = document.createElement("input");
  checkbox.type = type;
  checkbox.classList.add(classNames);
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", onChange);
  return checkbox;
};

// Create a span element
const createSpan = (classNames: string, content: string): HTMLSpanElement => {
  const text = document.createElement("span");
  text.classList.add(classNames);
  text.textContent = content;
  return text;
};

// Create a button element
const createBtn = (
  btnName: string,
  classNames: string,
  onClick: (event: MouseEvent) => void
): HTMLButtonElement => {
  const btn = document.createElement("button");
  btn.textContent = btnName;
  btn.classList.add(classNames);
  btn.addEventListener("click", onClick);
  return btn;
};

// Create a new todo item
const newTodo = (text: string): ITodo => ({
  text,
  id: Date.now(),
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Main todo function
export const todo = (app: HTMLElement) => {
  const { todoInput, searchIcon, addBtn, filterField, listTodo } =
    getAllElements(app);
  let todoList: ITodo[] = JSON.parse(localStorage.getItem("todoList") || "[]");

  // Event listeners
  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => e.key === "Enter" && addTodo());
  searchIcon.addEventListener("click", searchTodo);
  filterField.addEventListener("change", filterTodo);

  // Add a new todo
  function addTodo() {
    const text = todoInput.value.trim();
    if (text === "") return;
    const todo = newTodo(text);
    todoList.push(todo);
    saveAndRender();
    todoInput.value = "";
  }

  // Parameters object for renderTodo
  const renderParams = {
    todoArr: todoList,
    container: listTodo,
    toggleComplete,
    updateTodo,
    deleteTodo,
  };

  // Filter todos based on selection
  function filterTodo() {
    const filteredTodoList =
      filterField.value === "active"
        ? todoList.filter((todo) => !todo.completed)
        : filterField.value === "completed"
        ? todoList.filter((todo) => todo.completed)
        : todoList;

    renderTodo({
      ...renderParams,
      todoArr: filteredTodoList,
    });
  }

  // Search todos based on input
  function searchTodo() {
    const input = todoInput.value.trim().toLowerCase();
    const searched = todoList.filter((todo) =>
      todo.text.toLowerCase().includes(input)
    );

    renderTodo({
      ...renderParams,
      todoArr: searched,
    });
  }

  // Delete a todo item
  function deleteTodo(id: number) {
    todoList = todoList.filter((todo) => todo.id !== id);
    saveAndRender();
  }

  // Toggle completion status of a todo item
  function toggleComplete(id: number) {
    todoList = todoList.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveAndRender();
  }

  // Update a todo item
  function updateTodo(id: number) {
    const text = prompt("Update your todo");
    if (text) {
      todoList = todoList.map((todo) =>
        todo.id === id ? { ...todo, text, updatedAt: new Date() } : todo
      );
      saveAndRender();
    }
  }

  // Save todo list to localStorage and render it
  function saveAndRender() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
    renderTodo({
      ...renderParams,
      todoArr: todoList,
    });
  }

  // Create a todo item element
  const createTodoElement = (
    todo: ITodo,
    toggleComplete: (id: number) => void,
    updateTodo: (id: number) => void,
    deleteTodo: (id: number) => void
  ) => {
    const li = document.createElement("li");
    li.classList.toggle("completed", todo.completed);

    const checkbox = createCheckbox(todo, "checkbox", "checkbox", () =>
      toggleComplete(todo.id)
    );
    const text = createSpan("todo-text", todo.text);

    const editBtn = createBtn("Edit", "edit-btn", (e) => {
      e.stopPropagation();
      updateTodo(todo.id);
    });

    const deleteBtn = createBtn("Delete", "delete-btn", (e) => {
      e.stopPropagation();
      deleteTodo(todo.id);
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
  };

  // Display a message when there are no todos
  const displayNoTodosMessage = (container: HTMLUListElement) => {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No todos available.";
    container.appendChild(emptyMsg);
  };

  // Render todo list based on the parameters
  const renderTodo = ({
    container,
    todoArr,
    toggleComplete,
    updateTodo,
    deleteTodo,
  }: IRender) => {
    container.innerHTML = "";

    if (todoArr.length === 0) {
      return displayNoTodosMessage(container);
    }

    for (const todo of todoArr) {
      const todoElement = createTodoElement(
        todo,
        toggleComplete,
        updateTodo,
        deleteTodo
      );
      container.appendChild(todoElement);
    }
  };

  renderTodo(renderParams);
};
