const express = require('express');
const router = express.Router();

module.exports = (todoService) => {
  /**
   * Get all todos.
   *
   * @route GET /api/todo
   * @returns {Object[]} 200 - Array of todos
   * @returns {Object} 500 - Server error
   */
  router.get('/', async (req, res) => {
    try {
      const todos = await todoService.getAll();
      res.json(todos);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  });

  /**
   * Get a todo by ID.
   *
   * @route GET /api/todo/:id
   * @param {string} req.params.id - ID of the todo
   * @returns {Object} 200 - The requested todo
   * @returns {Object} 404 - Not found
   * @returns {Object} 500 - Server error
   */
  router.get('/:id', async (req, res) => {
    try {
      const todo = await todoService.getById(req.params.id);
      if (!todo) return res.status(404).json({ error: 'Todo not found' });
      res.json(todo);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch todo' });
    }
  });

  /**
   * Create a new todo.
   *
   * @route POST /api/todo
   * @param {Object} req.body - New todo fields
   * @returns {Object} 201 - The created todo
   * @returns {Object} 400 - Invalid input
   */
  router.post('/', async (req, res) => {
    try {
      const newTodo = await todoService.create(req.body);
      res.status(201).json(newTodo);
    } catch (err) {
      res.status(400).json({ error: err.message || 'Invalid input' });
    }
  });

  /**
   * Update a todo by ID.
   *
   * @route PATCH /api/todo/:id
   * @param {string} req.params.id - ID of the todo
   * @param {Object} req.body - Fields to update (partial)
   * @returns {Object} 200 - Updated todo
   * @returns {Object} 400 - Validation or update error
   */
  router.patch('/:id', async (req, res) => {
    try {
      const updated = await todoService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message || 'Failed to update todo' });
    }
  });

  /**
   * Toggle the completed status of a todo by ID.
   *
   * @route PATCH /api/todo/:id/completed
   * @param {string} req.params.id - ID of the todo to toggle
   * @returns {Object} 200 - The updated todo with flipped completion status
   * @returns {Object} 404 - If the todo is not found
   * @returns {Object} 400 - On error during update
   */
  router.patch('/:id/completed', async (req, res) => {
    try {
      const todo = await todoService.getById(req.params.id);
      if (!todo) return res.status(404).json({ error: 'Todo not found' });

      const toggled = await todoService.isCompleted(req.params.id, !todo.completed);
      res.json(toggled);
    } catch (err) {
      res.status(400).json({ error: err.message || 'Failed to toggle completed status' });
    }
  });

  /**
   * Delete a todo by ID.
   *
   * @route DELETE /api/todo/:id
   * @param {string} req.params.id - ID of the todo
   * @returns {void} 204 - Successfully deleted
   * @returns {Object} 500 - Server error
   */
  router.delete('/:id', async (req, res) => {
    try {
      await todoService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  });

  return router;
};
