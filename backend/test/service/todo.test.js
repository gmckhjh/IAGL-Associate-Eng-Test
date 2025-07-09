const todoServiceFactory = require('../../src/service/todo');
const { createToDo } = require('../../src/models/todo');

// Mock data
const mockTodos = [
  { id: '1', title: 'Test 1', completed: false },
  { id: '2', title: 'Test 2', completed: true }
];

describe('Todo Service', () => {
  let mockRepository;
  let todoService;

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn().mockResolvedValue(mockTodos),
      getById: jest.fn().mockImplementation(id =>
        Promise.resolve(mockTodos.find(t => t.id === id) || null)
      ),
      isCompleted: jest.fn().mockResolvedValue({ ...mockTodos[0], completed: true }),
      update: jest.fn().mockResolvedValue({ ...mockTodos[0], title: 'Updated' }),
      delete: jest.fn().mockResolvedValue(true),
      create: jest.fn().mockImplementation(todo => Promise.resolve({ ...todo, id: 'new-id' }))
    };

    todoService = todoServiceFactory(mockRepository);
  });

  describe('getAll', () => {
    it('should return all todos', async () => {
      const result = await todoService.getAll();
      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockTodos);
    });
  });

  describe('getById', () => {
    it('should return a todo if found', async () => {
      const result = await todoService.getById('1');
      expect(mockRepository.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTodos[0]);
    });

    it('should return null if not found', async () => {
      const result = await todoService.getById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new todo from input', async () => {
      const input = { title: 'New todo', dueDate: '2025-07-20' };
      const result = await todoService.create(input);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('New todo');
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should throw if title is missing', async () => {
      await expect(todoService.create({})).rejects.toThrow('Title is required');
    });
  });

  describe('update', () => {
    it('should call repository.update with valid data', async () => {
      const result = await todoService.update('1', { title: 'Updated' });
      expect(mockRepository.update).toHaveBeenCalled();
      expect(result.title).toBe('Updated');
    });

    it('should throw if required fields are invalid', async () => {
      await expect(todoService.update('1', {})).rejects.toThrow('Title is required');
    });
  });

  describe('isCompleted', () => {
    it('should toggle completion status', async () => {
      const result = await todoService.isCompleted('1');
      expect(mockRepository.isCompleted).toHaveBeenCalledWith('1');
      expect(result.completed).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete a todo by ID', async () => {
      const result = await todoService.delete('1');
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });
  });
});