// // script.js
// document.addEventListener('DOMContentLoaded', () => {
//     const addBtn = document.getElementById('add-btn');
//     const todoInput = document.getElementById('todo-input');
//     const searchInput = document.getElementById('search-input');
//     const searchBtn = document.getElementById('search-btn');
//     const filterDropdown = document.getElementById('filter-dropdown');
//     const todoList = document.getElementById('todo-list');

//     let todos = [];

//     addBtn.addEventListener('click', addTodo);
//     todoInput.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter') {
//             addTodo();
//         }
//     });
//     searchBtn.addEventListener('click', searchTodos);
//     filterDropdown.addEventListener('change', () => {
//         filterTodos(filterDropdown.value);
//     });

//     function addTodo() {
//         const todoText = todoInput.value.trim();
//         if (todoText === '') {
//             return;
//         }

//         const todo = {
//             id: Date.now(),
//             text: todoText,
//             completed: false
//         };

//         todos.push(todo);
//         renderTodos(todos);
//         todoInput.value = '';
//         todoInput.focus();
//     }

//     function toggleComplete(id) {
//         todos = todos.map(todo => {
//             if (todo.id === id) {
//                 return { ...todo, completed: !todo.completed };
//             }
//             return todo;
//         });
//         renderTodos(todos);
//     }

//     function deleteTodo(id) {
//         todos = todos.filter(todo => todo.id !== id);
//         renderTodos(todos);
//     }

//     function searchTodos() {
//         const query = searchInput.value.toLowerCase();
//         const filteredTodos = todos.filter(todo => todo.text.toLowerCase().includes(query));
//         renderTodos(filteredTodos);
//     }

//     function filterTodos(filter) {
//         let filteredTodos = [];
//         if (filter === 'all') {
//             filteredTodos = todos;
//         } else if (filter === 'active') {
//             filteredTodos = todos.filter(todo => !todo.completed);
//         } else if (filter === 'completed') {
//             filteredTodos = todos.filter(todo => todo.completed);
//         }
//         renderTodos(filteredTodos);
//     }

//     function renderTodos(todosToRender) {
//         todoList.innerHTML = '';
//         todosToRender.forEach(todo => {
//             const li = document.createElement('li');
//             li.classList.toggle('completed', todo.completed);

//             const checkbox = document.createElement('input');
//             checkbox.type = 'checkbox';
//             checkbox.classList.add('checkbox');
//             checkbox.checked = todo.completed;
//             checkbox.addEventListener('change', () => toggleComplete(todo.id));

//             const span = document.createElement('span');
//             span.textContent = todo.text;
//             span.addEventListener('dblclick', () => editTodoPrompt(todo.id));

//             const deleteBtn = document.createElement('button');
//             deleteBtn.textContent = 'Delete';
//             deleteBtn.classList.add('delete-btn');
//             deleteBtn.addEventListener('click', (e) => {
//                 e.stopPropagation();
//                 deleteTodo(todo.id);
//             });

//             const editBtn = document.createElement('button');
//             editBtn.textContent = 'Edit';
//             editBtn.classList.add('edit-btn');
//             editBtn.addEventListener('click', (e) => {
//                 e.stopPropagation();
//                 editTodoPrompt(todo.id);
//             });

//             li.appendChild(checkbox);
//             li.appendChild(span);
//             li.appendChild(editBtn);
//             li.appendChild(deleteBtn);
//             todoList.appendChild(li);
//         });
//     }

//     function editTodoPrompt(id) {
//         const newTodoText = prompt('Edit your todo:');
//         if (newTodoText) {
//             editTodoText(id, newTodoText);
//         }
//     }

//     function editTodoText(id, newText) {
//         todos = todos.map(todo => {
//             if (todo.id === id) {
//                 return { ...todo, text: newText };
//             }
//             return todo;
//         });
//         renderTodos(todos);
//     }
// });

// script.js
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
