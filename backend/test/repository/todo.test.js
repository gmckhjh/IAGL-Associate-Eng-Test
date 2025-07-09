const repository = require('../../src/repository/todo');

describe('Todo Repository', () => {
  beforeEach(async () => {
    //Reset data before each test
    repository.resetTodos([
      { id: '1', title: 'Test 1', completed: false },
      { id: '2', title: 'Test 2', completed: true, dateCompleted: '2025-07-01' }
    ]);
  });

  describe('getAll', () => {
    it('should return all todos', async () => {
      const todos = await repository.getAll();
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBe(2);
    });
  });

  describe('getById', () => {
    it('should return a todo by ID', async () => {
      const todos = await repository.getAll();
      const todo = await repository.getById(todos[0].id);
      expect(todo.title).toBe('Test 1');
    });

    it('should return null for invalid ID', async () => {
      const todo = await repository.getById('nonexistent');
      expect(todo).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new todo with generated ID', async () => {
      const todo = await repository.create({ title: 'New Task' });
      expect(todo).toHaveProperty('id');
      expect(todo.title).toBe('New Task');
    });

    it('should allow empty optional fields', async () => {
      const todo = await repository.create({ title: 'No content' });
      expect(todo.content).toBeUndefined(); // You’re not setting it in the repo
    });

    it('should not overwrite existing todos', async () => {
      await repository.create({ title: 'Test 3' });
      const todos = await repository.getAll();
      expect(todos.length).toBe(3);
    });
  });

  describe('update', () => {
    it('should update an existing todo', async () => {
      const [todo] = await repository.getAll();
      const updated = await repository.update(todo.id, { content: 'Updated content' });
      expect(updated.content).toBe('Updated content');
    });

    it('should preserve original ID', async () => {
      const [todo] = await repository.getAll();
      const updated = await repository.update(todo.id, { id: 'fake' });
      expect(updated.id).toBe(todo.id);
    });

    it('should return null for invalid ID', async () => {
      const result = await repository.update('fake-id', { title: 'Nope' });
      expect(result).toBeNull();
    });
  });

  describe('isCompleted (toggle)', () => {
    it('should toggle completed from false to true', async () => {
      const [todo] = await repository.getAll();
      const updated = await repository.isCompleted(todo.id);
      expect(updated.completed).toBe(true);
      expect(updated.dateCompleted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should toggle completed from true to false', async () => {
      const todos = await repository.getAll();
      const completedTodo = todos.find(t => t.completed);
      const toggled = await repository.isCompleted(completedTodo.id);
      expect(toggled.completed).toBe(false);
      expect(toggled.dateCompleted).toBeNull();
    });

    it('should return null for unknown ID', async () => {
      const result = await repository.isCompleted('bad-id');
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a todo by ID', async () => {
      const [todo] = await repository.getAll();
      const result = await repository.delete(todo.id);
      expect(result).toBe(true);

      const check = await repository.getById(todo.id);
      expect(check).toBeNull();
    });

    it('should return false for non-existent ID', async () => {
      const result = await repository.delete('not-found');
      expect(result).toBe(false);
    });
  });
});