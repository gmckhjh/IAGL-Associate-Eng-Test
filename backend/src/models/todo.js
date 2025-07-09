/**
 * Constructs a valid todo object with default values and validation.
 *
 * @param {Object} data - Input fields for the todo
 * @param {string} data.title - Required title of the todo
 * @param {string} [data.content] - Optional details
 * @param {boolean} [data.completed=false] - Completion status
 * @param {string|null} [data.dateCompleted=null] - Date completed
 * @param {string|null} [data.dueDate=null] - Due date
 * @returns {Object} A properly structured todo object
 * @throws {Error} If title is missing
 */
function createTodo({ title, content = '', completed = false, dateCompleted = null, dueDate = null }) {
  if (!title) {
    throw new Error('Title is required');
  }

  return {
    title,
    content,
    completed,
    dateCompleted,
    dueDate,
    dateCreated: new Date().toISOString().slice(0, 10)
  };
}

module.exports = { createTodo };