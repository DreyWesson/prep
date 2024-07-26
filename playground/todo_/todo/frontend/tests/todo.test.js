import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { ui } from '../ui';
import { todo } from '../todo.func';
// import { Todo } from '../todo.class';

describe('Todo App', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="app">${ui}</div>`;
    const app = document.querySelector('#app');
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
    const todoInput = screen.getByPlaceholderText("Enter todo");
    const addBtn = screen.getByTestId("add-todo-btn");
    fireEvent.change(todoInput, { target: { value: "Todo to delete" } });
    fireEvent.click(addBtn);
    expect(screen.getByText("Todo to delete")).toBeInTheDocument();
    const deleteBtn = screen.getByText("Delete");
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(screen.queryByText("Todo to delete")).not.toBeInTheDocument();
    });
  });

  it('filters todos by completed status', () => {
    const inputElement = screen.getByPlaceholderText(/Enter todo/i);
    const addButton = screen.getByTestId("add-todo-btn");

    fireEvent.change(inputElement, { target: { value: 'Todo 1' } });
    fireEvent.click(addButton);
    fireEvent.change(inputElement, { target: { value: 'Todo 2' } });
    fireEvent.click(addButton);

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    const filterSelect = screen.getByRole('combobox');
    fireEvent.change(filterSelect, { target: { value: 'completed' } });

    const completedTodo = screen.getByText('Todo 1');
    const activeTodo = screen.queryByText('Todo 2');

    expect(completedTodo).toBeInTheDocument();
    expect(activeTodo).not.toBeInTheDocument();
  });

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