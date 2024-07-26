export interface ITodo {
  text: string;
  id: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface IElement {
  todoInput: HTMLInputElement;
  searchIcon: HTMLButtonElement;
  addBtn: HTMLButtonElement;
  filterField: HTMLSelectElement;
  listTodo: HTMLUListElement;
}

export interface IRender {
  todoArr: ITodo[];
  container: HTMLUListElement;
  toggleComplete: (id: number) => void;
  updateTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}
