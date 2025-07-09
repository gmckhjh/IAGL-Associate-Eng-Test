//Test Data
let todoList = [
  {
    id: '1',
    title: 'Buy groceries',
    content: 'Milk, eggs, bread, and butter',
    completed: false,
    dateCompleted: null,
    dueDate: '2025-07-12',
    dateCreated: '2025-07-08'
  },
  {
    id: '2',
    title: 'Call the bank',
    content: 'Follow up on missing transaction',
    completed: true,
    dateCompleted: '2025-07-07',
    dueDate: null,
    dateCreated: '2025-07-06'
  },
  {
    id: '3',
    title: 'Finish tech assignment',
    content: '',
    completed: false,
    dateCompleted: null,
    dueDate: '2025-07-10',
    dateCreated: '2025-07-08'
  },
  {
    id: '4',
    title: 'Water plants',
    content: 'Indoor and balcony plants',
    completed: true,
    dateCompleted: '2025-07-09',
    dueDate: null,
    dateCreated: '2025-07-07'
  },
  {
    id: '5',
    title: 'Clean workspace',
    content: '',
    completed: false,
    dateCompleted: null,
    dueDate: '2025-07-13',
    dateCreated: '2025-07-08'
  },
  {
    id: '6',
    title: 'Schedule dentist appointment',
    content: 'Prefer morning slots',
    completed: false,
    dateCompleted: null,
    dueDate: null,
    dateCreated: '2025-07-08'
  },
  {
    id: '7',
    title: 'Read documentation',
    content: 'Look into Express testing guides',
    completed: false,
    dateCompleted: null,
    dueDate: '2025-07-14',
    dateCreated: '2025-07-08'
  }
];

//Testing purposes only
const resetTodos = (initial = []) => {
  todoList = [...initial];
};

//--------------------------------
//Module

// Simple ID generator
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

module.exports = {
  /**
   * Get all todos.
   * @returns {Promise<Array>}
   */
  getAll: () => Promise.resolve(todoList),

  /**
   * Get a single todo by ID.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  getById: (id) => {
    const todo = todoList.find(t => t.id === id);
    return Promise.resolve(todo || null);
  },

  /**
   * Toggle completed status of a todo.
   *
   * @param {string} id - ID of the todo to toggle
   * @returns {Promise<Object|null>} The updated todo, or null if not found
   */
  isCompleted: (id) => {
    const todo = todoList.find(t => t.id === id);
    if (!todo) return Promise.resolve(null);

    todo.completed = !todo.completed;
    todo.dateCompleted = todo.completed ? new Date().toISOString().slice(0, 10) : null;

    return Promise.resolve(todo);
  },

  /**
   * Update a todo by ID. Accepts partial fields.
   * @param {string} id
   * @param {Object} updatedTodo
   * @returns {Promise<Object|null>}
   */
  update: (id, updatedTodo) => {
    const index = todoList.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(null);

    todoList[index] = { ...todoList[index], ...updatedTodo, id };
    return Promise.resolve(todoList[index]);
  },

  /**
   * Delete a todo by ID.
   * @param {string} id
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  delete: (id) => {
    const index = todoList.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(false);

    todoList.splice(index, 1);
    return Promise.resolve(true);
  },

  /**
   * Create a new todo with a generated ID.
   * @param {Object} todo
   * @returns {Promise<Object>} The created todo
   */
  create: (todo) => {
    const withId = { ...todo, id: generateId() };
    todoList.push(withId);
    return Promise.resolve(withId);
  },
  resetTodos
};
