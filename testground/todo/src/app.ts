// import { renderTodo, saveToLocalStorage } from "./helper";
// import { IElement, ITodo } from "./interfaces";
// import { createNewTodo, deleteTodoById, toggleTodoCompletion, updateTodoText } from "./todo";

// // Get all required elements from the DOM
// const getAllElements = (app: HTMLElement): IElement => {
//   return {
//     todoInput: app.querySelector("#todo-input")!,
//     searchIcon: app.querySelector("#search-todo")!,
//     addBtn: app.querySelector("#add-todo")!,
//     filterField: app.querySelector("#filter-input")!,
//     listTodo: app.querySelector("#todo-list")!,
//   };
// };

// export const todo = (app: HTMLElement) => {
//   const { todoInput, searchIcon, addBtn, filterField, listTodo } =
//     getAllElements(app);
//   let todoList: ITodo[] = JSON.parse(localStorage.getItem("todoList") || "[]");

//   // Save todo list to localStorage and render it
//   const saveAndRender = () => {
//     saveToLocalStorage(todoList);
//     renderTodo({
//       todoArr: todoList,
//       container: listTodo,
//       toggleComplete: (id: number) => {
//         todoList = toggleTodoCompletion(todoList, id);
//         saveAndRender();
//       },
//       updateTodo: (id: number) => {
//         const text = prompt("Update your todo");
//         if (text) {
//           todoList = updateTodoText(todoList, id, text);
//           saveAndRender();
//         }
//       },
//       deleteTodo: (id: number) => {
//         todoList = deleteTodoById(todoList, id);
//         saveAndRender();
//       }
//     });
//   };

//   // Event listeners
//   addBtn.addEventListener("click", () => {
//     const text = todoInput.value.trim();
//     if (text === "") return;
//     const todo = createNewTodo(text);
//     todoList = [...todoList, todo];
//     saveAndRender();
//     todoInput.value = "";
//   });
//   todoInput.addEventListener("keypress", (e) => e.key === "Enter" && addTodo());
//   searchIcon.addEventListener("click", searchTodo);
//   filterField.addEventListener("change", filterTodo);

//   function addTodo() {
//     const text = todoInput.value.trim();
//     if (text === "") return;
//     const todo = createNewTodo(text);
//     todoList = [...todoList, todo];
//     saveAndRender();
//     todoInput.value = "";
//   }

//   function filterTodo() {
//     const filteredTodoList =
//       filterField.value === "active"
//         ? todoList.filter((todo) => !todo.completed)
//         : filterField.value === "completed"
//         ? todoList.filter((todo) => todo.completed)
//         : todoList;

//     renderTodo({
//       todoArr: filteredTodoList,
//       container: listTodo,
//       toggleComplete: (id: number) => {
//         todoList = toggleTodoCompletion(todoList, id);
//         saveAndRender();
//       },
//       updateTodo: (id: number) => {
//         const text = prompt("Update your todo");
//         if (text) {
//           todoList = updateTodoText(todoList, id, text);
//           saveAndRender();
//         }
//       },
//       deleteTodo: (id: number) => {
//         todoList = deleteTodoById(todoList, id);
//         saveAndRender();
//       }
//     });
//   }

//   function searchTodo() {
//     const input = todoInput.value.trim().toLowerCase();
//     const searched = todoList.filter((todo) =>
//       todo.text.toLowerCase().includes(input)
//     );

//     renderTodo({
//       todoArr: searched,
//       container: listTodo,
//       toggleComplete: (id: number) => {
//         todoList = toggleTodoCompletion(todoList, id);
//         saveAndRender();
//       },
//       updateTodo: (id: number) => {
//         const text = prompt("Update your todo");
//         if (text) {
//           todoList = updateTodoText(todoList, id, text);
//           saveAndRender();
//         }
//       },
//       deleteTodo: (id: number) => {
//         todoList = deleteTodoById(todoList, id);
//         saveAndRender();
//       }
//     });
//   }

//   renderTodo({
//     todoArr: todoList,
//     container: listTodo,
//     toggleComplete: (id: number) => {
//       todoList = toggleTodoCompletion(todoList, id);
//       saveAndRender();
//     },
//     updateTodo: (id: number) => {
//       const text = prompt("Update your todo");
//       if (text) {
//         todoList = updateTodoText(todoList, id, text);
//         saveAndRender();
//       }
//     },
//     deleteTodo: (id: number) => {
//       todoList = deleteTodoById(todoList, id);
//       saveAndRender();
//     }
//   });
// };

import { createBtn, createCheckbox, createSpan, getAllElements } from "./helper";
import { ITodo, IElement } from "./interfaces";
import { createHandlers, createTodo, saveToLocalStorage } from "./todo";

// Helper functions




// Main todo logic
export const todo = (app: HTMLElement) => {
  const { todoInput, searchIcon, addBtn, filterField, listTodo } =
    getAllElements(app);

  let todoList: ITodo[] = JSON.parse(localStorage.getItem("todoList") || "[]");

  // Function declarations
  const saveAndRender = () => {
    saveToLocalStorage(todoList);
    renderTodo({
      todoArr: todoList,
      container: listTodo,
      ...createHandlers((newList) => {
        todoList = newList;
        saveAndRender();
      })
    });
  };

  const renderTodo = ({
    todoArr,
    container,
    toggleComplete,
    updateTodo,
    deleteTodo
  }: {
    todoArr: ITodo[];
    container: HTMLUListElement;
    toggleComplete: (id: number) => void;
    updateTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
  }) => {
    container.innerHTML = "";
    if (todoArr.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No todos available.";
      container.appendChild(emptyMsg);
      return;
    }

    todoArr.forEach((todo) => {
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

      [checkbox, text, editBtn, deleteBtn].forEach((child) =>
        li.appendChild(child)
      );
      container.appendChild(li);
    });
  };

  const addTodo = () => {
    const text = todoInput.value.trim();
    if (text === "") return;
    const todo = createTodo(text);
    todoList.push(todo);
    saveAndRender();
    todoInput.value = "";
  };

  const filterTodo = () => {
    const filteredTodoList =
      filterField.value === "active"
        ? todoList.filter((todo) => !todo.completed)
        : filterField.value === "completed"
        ? todoList.filter((todo) => todo.completed)
        : todoList;

    renderTodo({
      todoArr: filteredTodoList,
      container: listTodo,
      ...createHandlers((newList) => {
        todoList = newList;
        saveAndRender();
      })
    });
  };

  const searchTodo = () => {
    const input = todoInput.value.trim().toLowerCase();
    const searched = todoList.filter((todo) =>
      todo.text.toLowerCase().includes(input)
    );

    renderTodo({
      todoArr: searched,
      container: listTodo,
      ...createHandlers((newList) => {
        todoList = newList;
        saveAndRender();
      })
    });
  };

  // Event listeners
  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => e.key === "Enter" && addTodo());
  searchIcon.addEventListener("click", searchTodo);
  filterField.addEventListener("change", filterTodo);

  // Initial render
  renderTodo({
    todoArr: todoList,
    container: listTodo,
    ...createHandlers((newList) => {
      todoList = newList;
      saveAndRender();
    })
  });
};
