import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import { todo } from "../src/app";
import { ui } from "../src";

describe("Todo", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="app">${ui}</div>`;
    const app: HTMLElement = document.querySelector("#app")!;
    todo(app);
  });
  it('renders the todo input and buttons', () => {
    const input = screen.getByPlaceholderText('Enter todo');
    const addButton = screen.getByTestId("add-todo-btn");
    const searchButton = screen.getByTestId("search-todo-btn");

    expect(input).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  it('adds a new todo', () => {
    const inputElement = screen.getByPlaceholderText(/Enter todo/i);
    const addButton = screen.getByTestId("add-todo-btn");

    fireEvent.change(inputElement, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);

    const todoItem = screen.getByText(/New Todo/i);
    expect(todoItem).toBeInTheDocument();
    const todoItems = screen.queryAllByRole('listitem');
    expect(todoItems).toHaveLength(1);
  });

//   it('does not add empty todos', () => {
//     const addButton = screen.getByTestId("add-todo-btn");

//     fireEvent.click(addButton);

//     const todoItems = screen.queryAllByRole('listitem');
//     expect(todoItems).toHaveLength(0);
//   });

it('searches todos by text', () => {
    const inputElement = screen.getByPlaceholderText(/Enter todo/i);
    const addButton = screen.getByTestId("add-todo-btn");

    fireEvent.change(inputElement, { target: { value: 'Buy groceries' } });
    fireEvent.click(addButton);
    fireEvent.change(inputElement, { target: { value: 'Walk the dog' } });
    fireEvent.click(addButton);

    const searchInput = screen.getByPlaceholderText(/Enter todo/i);
    fireEvent.change(searchInput, { target: { value: 'groceries' } });
    const searchButton = screen.getByTestId("search-todo-btn");
    fireEvent.click(searchButton);

    const searchedTodo = screen.getByText('Buy groceries');
    const otherTodo = screen.queryByText('Walk the dog');

    expect(searchedTodo).toBeInTheDocument();
    expect(otherTodo).not.toBeInTheDocument();
  });
});
