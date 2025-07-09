const request = require('supertest');
const express = require('express');
const todoRoutes = require('../../src/routes/todoroutes');

// Mock service
const mockService = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  isCompleted: jest.fn(),
  delete: jest.fn()
};

const app = express();
app.use(express.json());
app.use('/api/todo', todoRoutes(mockService));

describe('Todo Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/todo', () => {
    it('should return all todos', async () => {
      const todos = [{ id: '1', title: 'Sample' }];
      mockService.getAll.mockResolvedValue(todos);

      const res = await request(app).get('/api/todo');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(todos);
      expect(mockService.getAll).toHaveBeenCalled();
    });

    it('should handle server error', async () => {
      mockService.getAll.mockRejectedValue(new Error('fail'));
      const res = await request(app).get('/api/todo');
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/todo/:id', () => {
    it('should return a todo by ID', async () => {
      const todo = { id: '1', title: 'One' };
      mockService.getById.mockResolvedValue(todo);

      const res = await request(app).get('/api/todo/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(todo);
    });

    it('should return 404 if todo not found', async () => {
      mockService.getById.mockResolvedValue(null);
      const res = await request(app).get('/api/todo/unknown');
      expect(res.statusCode).toBe(404);
    });

    it('should return 500 on error', async () => {
      mockService.getById.mockRejectedValue(new Error());
      const res = await request(app).get('/api/todo/1');
      expect(res.statusCode).toBe(500);
    });
  });

  describe('POST /api/todo', () => {
    it('should create a new todo', async () => {
      const newTodo = { title: 'New' };
      const created = { id: '1', ...newTodo };
      mockService.create.mockResolvedValue(created);

      const res = await request(app).post('/api/todo').send(newTodo);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(created);
    });

    it('should handle bad input', async () => {
      mockService.create.mockRejectedValue(new Error('Invalid input'));
      const res = await request(app).post('/api/todo').send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PATCH /api/todo/:id', () => {
    it('should update a todo', async () => {
      const updated = { id: '1', title: 'Updated' };
      mockService.update.mockResolvedValue(updated);

      const res = await request(app).patch('/api/todo/1').send({ title: 'Updated' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it('should handle update failure', async () => {
      mockService.update.mockRejectedValue(new Error('Fail'));
      const res = await request(app).patch('/api/todo/1').send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PATCH /api/todo/:id/completed', () => {
    it('should toggle completed status', async () => {
      const todo = { id: '1', completed: false };
      const toggled = { ...todo, completed: true };

      mockService.getById.mockResolvedValue(todo);
      mockService.isCompleted.mockResolvedValue(toggled);

      const res = await request(app).patch('/api/todo/1/completed');
      expect(res.statusCode).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('should return 404 if todo not found', async () => {
      mockService.getById.mockResolvedValue(null);
      const res = await request(app).patch('/api/todo/bad/completed');
      expect(res.statusCode).toBe(404);
    });

    it('should return 400 on error', async () => {
      mockService.getById.mockResolvedValue({ id: '1', completed: false });
      mockService.isCompleted.mockRejectedValue(new Error('toggle failed'));

      const res = await request(app).patch('/api/todo/1/completed');
      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/todo/:id', () => {
    it('should delete a todo', async () => {
      mockService.delete.mockResolvedValue(true);

      const res = await request(app).delete('/api/todo/1');
      expect(res.statusCode).toBe(204);
    });

    it('should return 500 on delete error', async () => {
      mockService.delete.mockRejectedValue(new Error('fail'));
      const res = await request(app).delete('/api/todo/1');
      expect(res.statusCode).toBe(500);
    });
  });
});