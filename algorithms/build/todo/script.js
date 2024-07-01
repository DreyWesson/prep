document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-btn');
    const todoInput = document.getElementById('todo-input');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filterDropdown = document.getElementById('filter-dropdown');
    const todoList = document.getElementById('todo-list');
    let todos = [];

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    searchBtn.addEventListener('click', searchTodos);
    filterDropdown.addEventListener('change', () => {
        filterTodos(filterDropdown.value);
    });

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText === '') {
            return;
        }

        const todo = {
            id: Date.now(),
            text: todoText,
            completed: false
        };

        todos.push(todo);
        renderTodos(todos);
        todoInput.value = '';
        todoInput.focus();
    }

    function toggleComplete(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        renderTodos(todos);
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        renderTodos(todos);
    }

    function searchTodos() {
        const query = searchInput.value.toLowerCase();
        const filteredTodos = todos.filter(todo => todo.text.toLowerCase().includes(query));
        renderTodos(filteredTodos);
    }

    function filterTodos(filter) {
        let filteredTodos = [];
        if (filter === 'all') {
            filteredTodos = todos;
        } else if (filter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }
        renderTodos(filteredTodos);
    }

    function renderTodos(todosToRender) {
        todoList.innerHTML = '';
        todosToRender.forEach(todo => {
            const li = document.createElement('li');
            li.classList.toggle('completed', todo.completed);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('checkbox');
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleComplete(todo.id));

            const span = document.createElement('span');
            span.classList.add('todo-text');
            span.textContent = todo.text;
            span.addEventListener('dblclick', () => editTodoPrompt(todo.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTodo(todo.id);
            });

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editTodoPrompt(todo.id);
            });

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    }

    function editTodoPrompt(id) {
        const newTodoText = prompt('Edit your todo:');
        if (newTodoText) {
            editTodoText(id, newTodoText);
        }
    }

    function editTodoText(id, newText) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, text: newText };
            }
            return todo;
        });
        renderTodos(todos);
    }
});

// document.addEventListener('DOMContentLoaded', () => {
//     class TodoApp {
//         constructor() {
//             this.addBtn = document.getElementById('add-btn');
//             this.todoInput = document.getElementById('todo-input');
//             this.searchInput = document.getElementById('search-input');
//             this.searchBtn = document.getElementById('search-btn');
//             this.filterDropdown = document.getElementById('filter-dropdown');
//             this.todoList = document.getElementById('todo-list');
//             this.todos = [];

//             this.addBtn.addEventListener('click', () => this.addTodo());
//             this.todoInput.addEventListener('keypress', (e) => {
//                 if (e.key === 'Enter') {
//                     this.addTodo();
//                 }
//             });
//             this.searchBtn.addEventListener('click', () => this.searchTodos());
//             this.filterDropdown.addEventListener('change', () => {
//                 this.filterTodos(this.filterDropdown.value);
//             });
//         }

//         addTodo() {
//             const todoText = this.todoInput.value.trim();
//             if (todoText === '') {
//                 return;
//             }

//             const todo = {
//                 id: Date.now(),
//                 text: todoText,
//                 completed: false
//             };

//             this.todos.push(todo);
//             this.renderTodos(this.todos);
//             this.todoInput.value = '';
//             this.todoInput.focus();
//         }

//         toggleComplete(id) {
//             this.todos = this.todos.map(todo => {
//                 if (todo.id === id) {
//                     return { ...todo, completed: !todo.completed };
//                 }
//                 return todo;
//             });
//             this.renderTodos(this.todos);
//         }

//         deleteTodo(id) {
//             this.todos = this.todos.filter(todo => todo.id !== id);
//             this.renderTodos(this.todos);
//         }

//         searchTodos() {
//             const query = this.searchInput.value.toLowerCase();
//             const filteredTodos = this.todos.filter(todo => todo.text.toLowerCase().includes(query));
//             this.renderTodos(filteredTodos);
//         }

//         filterTodos(filter) {
//             let filteredTodos = [];
//             if (filter === 'all') {
//                 filteredTodos = this.todos;
//             } else if (filter === 'active') {
//                 filteredTodos = this.todos.filter(todo => !todo.completed);
//             } else if (filter === 'completed') {
//                 filteredTodos = this.todos.filter(todo => todo.completed);
//             }
//             this.renderTodos(filteredTodos);
//         }

//         renderTodos(todosToRender) {
//             this.todoList.innerHTML = '';
//             todosToRender.forEach(todo => {
//                 const li = document.createElement('li');
//                 li.classList.toggle('completed', todo.completed);

//                 const checkbox = document.createElement('input');
//                 checkbox.type = 'checkbox';
//                 checkbox.classList.add('checkbox');
//                 checkbox.checked = todo.completed;
//                 checkbox.addEventListener('change', () => this.toggleComplete(todo.id));

//                 const label = document.createElement('label');
//                 label.setAttribute('for', `checkbox-${todo.id}`);
//                 label.classList.add('checkbox-label');
//                 label.textContent = 'Complete';

//                 const span = document.createElement('span');
//                 span.classList.add('todo-text');
//                 span.textContent = todo.text;
//                 span.addEventListener('dblclick', () => this.editTodoPrompt(todo.id));

//                 const deleteBtn = document.createElement('button');
//                 deleteBtn.textContent = 'Delete';
//                 deleteBtn.classList.add('delete-btn');
//                 deleteBtn.addEventListener('click', (e) => {
//                     e.stopPropagation();
//                     this.deleteTodo(todo.id);
//                 });

//                 const editBtn = document.createElement('button');
//                 editBtn.textContent = 'Edit';
//                 editBtn.classList.add('edit-btn');
//                 editBtn.addEventListener('click', (e) => {
//                     e.stopPropagation();
//                     this.editTodoPrompt(todo.id);
//                 });

//                 li.appendChild(checkbox);
//                 li.appendChild(label); // Append the label after the checkbox
//                 li.appendChild(span);
//                 li.appendChild(editBtn);
//                 li.appendChild(deleteBtn);
//                 this.todoList.appendChild(li);
//             });
//         }

//         editTodoPrompt(id) {
//             const newTodoText = prompt('Edit your todo:');
//             if (newTodoText) {
//                 this.editTodoText(id, newTodoText);
//             }
//         }

//         editTodoText(id, newText) {
//             this.todos = this.todos.map(todo => {
//                 if (todo.id === id) {
//                     return { ...todo, text: newText };
//                 }
//                 return todo;
//             });
//             this.renderTodos(this.todos);
//         }
//     }

//     const app = new TodoApp();
// });

