import { screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
// import { todo } from '../todo.func';
import { Todo } from '../todo.class';

import { ui } from '../ui';

describe('Todo App', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="app">${ui}</div>`;

    const app = document.querySelector('#app');
    new Todo(app);
    // todo(app);
  });

  it('renders the todo input and button', () => {
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
  });

  it('does not add empty todos', () => {
    const addButton = screen.getByTestId("add-todo-btn");

    fireEvent.click(addButton);

    const todoItems = screen.queryAllByRole('listitem');
    expect(todoItems).toHaveLength(0);
  });
});