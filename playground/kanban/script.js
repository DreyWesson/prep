// script.js
document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('add-task-form');
    const taskNameInput = document.getElementById('task-name');
    const columns = {
      todo: document.querySelector('#todo .task-list'),
      'in-progress': document.querySelector('#in-progress .task-list'),
      done: document.querySelector('#done .task-list')
    };
  
    let tasks = {
      todo: [],
      'in-progress': [],
      done: []
    };
  
    function renderTasks() {
      for (const [status, taskList] of Object.entries(tasks)) {
        columns[status].innerHTML = '';
        taskList.forEach(task => {
          const taskElement = document.createElement('div');
          taskElement.className = 'task';
          taskElement.innerHTML = `
            ${task.name}
            <button class="move-btn" data-id="${task.id}" data-direction="left">&lt;</button>
            <button class="move-btn" data-id="${task.id}" data-direction="right">&gt;</button>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
          `;
          columns[status].appendChild(taskElement);
        });
      }
  
      document.querySelectorAll('.move-btn').forEach(button =>
        button.addEventListener('click', handleMoveTask)
      );
      document.querySelectorAll('.delete-btn').forEach(button =>
        button.addEventListener('click', handleDeleteTask)
      );
    }
  
    function handleAddTask(event) {
      event.preventDefault();
      const taskName = taskNameInput.value.trim();
      if (!taskName) return;
  
      const task = {
        id: Date.now(),
        name: taskName,
        status: 'todo'
      };
      tasks.todo.push(task);
      renderTasks();
      taskNameInput.value = '';
    }
  
    function handleMoveTask(event) {
      const id = parseInt(event.target.dataset.id, 10);
      const direction = event.target.dataset.direction;
  
      for (const [status, taskList] of Object.entries(tasks)) {
        const taskIndex = taskList.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
          const [task] = taskList.splice(taskIndex, 1);
          if (direction === 'left') {
            if (status === 'in-progress') {
              tasks.todo.push(task);
            } else if (status === 'done') {
              tasks['in-progress'].push(task);
            }
          } else if (direction === 'right') {
            if (status === 'todo') {
              tasks['in-progress'].push(task);
            } else if (status === 'in-progress') {
              tasks.done.push(task);
            }
          }
          break;
        }
      }
      renderTasks();
    }
  
    function handleDeleteTask(event) {
      const id = parseInt(event.target.dataset.id, 10);
      for (const [status, taskList] of Object.entries(tasks)) {
        tasks[status] = taskList.filter(task => task.id !== id);
      }
      renderTasks();
    }
  
    addTaskForm.addEventListener('submit', handleAddTask);
  });
  