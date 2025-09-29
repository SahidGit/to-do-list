// References
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const STORAGE_KEY = 'todo_tasks_v1';

// Load tasks from localStorage
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Save tasks array to localStorage
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Render a single task object into the DOM
function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  if (task.completed) li.classList.add('completed');
  li.dataset.id = task.id;

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = task.text;
  span.tabIndex = 0;
  span.setAttribute('role', 'button');
  span.setAttribute('aria-pressed', task.completed ? 'true' : 'false');

  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.type = 'button';
  removeBtn.title = 'Delete task';
  removeBtn.textContent = '🗑';

  li.appendChild(span);
  li.appendChild(removeBtn);

  taskList.appendChild(li);
}

// Re-render full list from storage
function renderAll() {
  taskList.innerHTML = '';
  const tasks = loadTasks();
  tasks.forEach(renderTask);
}

// Create a new task and persist
function createTask(text) {
  const tasks = loadTasks();
  const task = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    text: text,
    completed: false,
  };
  tasks.unshift(task);
  saveTasks(tasks);
  renderAll();
}

// Toggle completion and persist
function toggleTask(id) {
  const tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  tasks[idx].completed = !tasks[idx].completed;
  saveTasks(tasks);
  renderAll();
}

// Delete task and persist
function deleteTask(id) {
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
  renderAll();
}

// Handle add action
function handleAdd() {
  const text = taskInput.value.trim();
  if (!text) return;
  createTask(text);
  taskInput.value = '';
  taskInput.focus();
}

// Event bindings
addTaskBtn.addEventListener('click', handleAdd);

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAdd();
});

// Delegate clicks inside task list (toggle or delete)
taskList.addEventListener('click', (e) => {
  const li = e.target.closest('.task-item');
  if (!li) return;
  const id = li.dataset.id;
  if (e.target.classList.contains('remove-btn')) {
    deleteTask(id);
    return;
  }
  if (e.target.classList.contains('task-text')) {
    toggleTask(id);
    return;
  }
});

// Allow keyboard toggle (space/enter) on task text
taskList.addEventListener('keydown', (e) => {
  if (!e.target.classList || !e.target.classList.contains('task-text')) return;
  if (e.key === 'Enter' || e.key === ' ') {
    const li = e.target.closest('.task-item');
    if (!li) return;
    toggleTask(li.dataset.id);
  }
});

// Initial render
renderAll();
