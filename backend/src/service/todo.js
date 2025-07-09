const { createTodo } = require('../models/todo');

/**
 * Service layer for todo operations.
 * @param {Object} repository - Data access layer
 * @returns {Object} Service methods
 */
const todoService = (repository) => {
  return {
    /**
     * Get all todos.
     * @returns {Promise<Array>}
     */
    getAll: async () => {
      return await repository.getAll();
    },

    /**
     * Get a todo by ID.
     * @param {string} id
     * @returns {Promise<Object|null>}
     */
    getById: async (id) => {
      return await repository.getById(id);
    },

    /**
     * Update a todo's completed status.
     * @param {string} id
     * @param {boolean} isCompleted
     * @returns {Promise<Object|null>}
     */
    isCompleted: async (id) => {
      return await repository.isCompleted(id);
    },

    /**
     * Update a todo by ID.
     * @param {string} id
     * @param {Object} data - Partial todo fields
     * @returns {Promise<Object|null>}
     */
    update: async (id, data) => {
      const todo = createTodo(data);
      return await repository.update(id, todo);
    },

    /**
     * Delete a todo by ID.
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    delete: async (id) => {
      return await repository.delete(id);
    },

    /**
     * Create a new todo.
     * @param {Object} data - Todo fields
     * @returns {Promise<Object>}
     */
    create: async (data) => {
      const todo = createTodo(data);
      return await repository.create(todo);
    }
  };
};

module.exports = todoService;
