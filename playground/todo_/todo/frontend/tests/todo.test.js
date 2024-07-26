import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { todo } from '../todo.func';
// import { Todo } from '../todo.class';

import { ui } from '../ui';

// describe('Todo App', () => {
//   beforeEach(() => {
//     document.body.innerHTML = `<div id="app">${ui}</div>`;

//     const app = document.querySelector('#app');
//     new Todo(app);
//     // todo(app);
//   });

//   it('renders the todo input and button', () => {
//     const input = screen.getByPlaceholderText('Enter todo');
//     const addButton = screen.getByTestId("add-todo-btn");
//     const searchButton = screen.getByTestId("search-todo-btn");

//     expect(input).toBeInTheDocument();
//     expect(addButton).toBeInTheDocument();
//     expect(searchButton).toBeInTheDocument();
//   });

//   it('adds a new todo', () => {
//     const inputElement = screen.getByPlaceholderText(/Enter todo/i);
//     const addButton = screen.getByTestId("add-todo-btn");

//     fireEvent.change(inputElement, { target: { value: 'New Todo' } });
//     fireEvent.click(addButton);

//     const todoItem = screen.getByText(/New Todo/i);
//     expect(todoItem).toBeInTheDocument();
//   });

//   it('does not add empty todos', () => {
//     const addButton = screen.getByTestId("add-todo-btn");

//     fireEvent.click(addButton);

//     const todoItems = screen.queryAllByRole('listitem');
//     expect(todoItems).toHaveLength(0);
//   });
// });

describe('Todo App', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="app">${ui}</div>`;
    const app = document.querySelector('#app');
    todo(app);
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

  it('edits a todo', () => {
    const inputElement = screen.getByPlaceholderText(/Enter todo/i);
    const addButton = screen.getByTestId("add-todo-btn");

    fireEvent.change(inputElement, { target: { value: 'Old Todo' } });
    fireEvent.click(addButton);

    global.prompt = vi.fn(() => 'Updated Todo');

    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);
    
    const updatedTodoItem = screen.getByText(/Updated Todo/i);
    expect(updatedTodoItem).toBeInTheDocument();

    global.prompt.mockRestore();
  });

    it('deletes a todo', async () => {
    const inputElement = screen.getByPlaceholderText(/Enter todo/i);
    const addButton = screen.getByTestId("add-todo-btn");

    fireEvent.change(inputElement, { target: { value: 'Todo to delete' } });
    fireEvent.click(addButton);

    const addedTodoItem = screen.getByText(/Todo to delete/i);
    expect(addedTodoItem).toBeInTheDocument();

    const deleteButtons = screen.getAllByText(/Delete/i);
    expect(deleteButtons.length).toBeGreaterThan(0); // Ensure there's at least one delete button

    fireEvent.click(deleteButtons[0]);

    console.log('Before waitFor:', screen.getAllByText(/Todo to delete/i));

    // Wait for the todo item to be removed
    await waitFor(() => {
      const deletedTodoItem = screen.queryByText(/Todo to delete/i);
      console.log('After waitFor:', deletedTodoItem);
      expect(deletedTodoItem).not.toBeInTheDocument();
    });
  });


  it('filters todos by completed status', () => {
    // Add some todos
    const inputElement = screen.getByPlaceholderText(/Enter todo/i);
    const addButton = screen.getByTestId("add-todo-btn");

    fireEvent.change(inputElement, { target: { value: 'Todo 1' } });
    fireEvent.click(addButton);
    fireEvent.change(inputElement, { target: { value: 'Todo 2' } });
    fireEvent.click(addButton);

    // Mark one todo as completed
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    // Filter completed todos
    const filterSelect = screen.getByRole('combobox');
    fireEvent.change(filterSelect, { target: { value: 'completed' } });

    const completedTodo = screen.getByText('Todo 1');
    const activeTodo = screen.queryByText('Todo 2');

    expect(completedTodo).toBeInTheDocument();
    expect(activeTodo).not.toBeInTheDocument();
  });

  it('searches todos by text', () => {
    // Add some todos
    const inputElement = screen.getByPlaceholderText(/Enter todo/i);
    const addButton = screen.getByTestId("add-todo-btn");

    fireEvent.change(inputElement, { target: { value: 'Buy groceries' } });
    fireEvent.click(addButton);
    fireEvent.change(inputElement, { target: { value: 'Walk the dog' } });
    fireEvent.click(addButton);

    // Search for 'groceries'
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