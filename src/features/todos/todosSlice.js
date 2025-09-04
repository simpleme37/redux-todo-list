import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_TODOS = [
  { id: Date.now(), text: '待辦事項 1', tagIds: [666, 888], done: false },
  { id: Date.now() + 1, text: '待辦事項 2', tagIds: [666], done: true },
  { id: Date.now() + 2, text: '待辦事項 3', tagIds: [], done: false },
];

const loadFromLocalStorage = () => {
  // 先從 localStorage 取取看資料
  const raw = localStorage.getItem('todoApp.todos');
  // 假如無資料、"undefined"、"null"、空字串 -> 都回預設值
  if (!raw || raw === 'undefined' || raw === 'null') return DEFAULT_TODOS;
  // 正常取值處理成 JSON
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_TODOS;
  } catch {
    localStorage.removeItem('todoApp.todos');
    return DEFAULT_TODOS;
  }
};

const todosSlice = createSlice({
  name: 'todos',
  initialState: loadFromLocalStorage(),
  reducers: {
    addTodo: (state, action) => {
      state.push({ id: Date.now(), text: action.payload, tagIds: [], done: false });
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.done = !todo.done;
        if (todo.done) {
          todo.completedAt = new Date().toISOString();
        } else {
          delete todo.completedAt;
        }
      }
    },
    deleteTodo: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    },
    clearTodo: () => {
      return [];
    },
    updateTodo: (state, action) => {
      const { id, text } = action.payload;
      const todo = state.find(t => t.id === id);
      if (todo) {
        todo.text = text;
      }
    },
    assignTagToTodo: (state, action) => {
      const { todoId, tagId } = action.payload;
      const todo = state.find(t => t.id === todoId);
      if (todo && !todo.tagIds.includes(tagId)) {
        todo.tagIds.push(tagId);
      }
    },
    removeTagFromTodo: (state, action) => {
      const { todoId, tagId } = action.payload;
      const todo = state.find(t => t.id === todoId);
      if (todo) {
        todo.tagIds = todo.tagIds.filter(id => id !== tagId);
      }
    },
    removeTagFromAllTodos: (state, action) => {
      const tagId = action.payload;
      state.forEach(todo => {
        todo.tagIds = todo.tagIds.filter(id => id !== tagId);
      });
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  clearTodo,
  updateTodo,
  assignTagToTodo,
  removeTagFromTodo,
  removeTagFromAllTodos,
} = todosSlice.actions;

export default (state, action) => {
  const newState = todosSlice.reducer(state, action);

  try {
    localStorage.setItem('todoApp.todos', JSON.stringify(newState));
  } catch (err) {
    console.error('Failed to save todos', err);
  }

  return newState;
};
