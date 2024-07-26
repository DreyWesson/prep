import { IElement, ITodo } from "./interfaces";

export const getAllElements = (app: HTMLElement): IElement => {
  return {
    todoInput: app.querySelector("#todo-input")!,
    searchIcon: app.querySelector("#search-todo")!,
    addBtn: app.querySelector("#add-todo")!,
    filterField: app.querySelector("#filter-input")!,
    listTodo: app.querySelector("#todo-list")!,
  };
};

export const createCheckbox = (
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

export const createSpan = (classNames: string, content: string): HTMLSpanElement => {
  const text = document.createElement("span");
  text.classList.add(classNames);
  text.textContent = content;
  return text;
};

export const createBtn = (
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

