import { ITodo } from "./interfaces";

// Pure functions for todo operations
export const toggleTodoCompletion = (todoList: ITodo[], id: number): ITodo[] =>
  todoList.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

export const updateTodoText = (todoList: ITodo[], id: number, text: string): ITodo[] =>
  todoList.map((todo) =>
    todo.id === id ? { ...todo, text, updatedAt: new Date() } : todo
  );

export const deleteTodoById = (todoList: ITodo[], id: number): ITodo[] =>
  todoList.filter((todo) => todo.id !== id);

export const saveToLocalStorage = (todoList: ITodo[]) => {
  localStorage.setItem("todoList", JSON.stringify(todoList));
};

export const createTodo = (text: string): ITodo => ({
  text,
  id: Date.now(),
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Handlers creation
export const createHandlers = (
  updateTodoList: (newList: ITodo[]) => void
) => ({
  toggleComplete: (id: number) => (todoList: ITodo[]) => {
    const updatedList = toggleTodoCompletion(todoList, id);
    updateTodoList(updatedList);
  },
  updateTodo: (id: number) => (todoList: ITodo[]) => {
    const text = prompt("Update your todo");
    if (text) {
      const updatedList = updateTodoText(todoList, id, text);
      updateTodoList(updatedList);
    }
  },
  deleteTodo: (id: number) => (todoList: ITodo[]) => {
    const updatedList = deleteTodoById(todoList, id);
    updateTodoList(updatedList);
  }
});