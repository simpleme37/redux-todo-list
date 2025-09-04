// 全局資料倉庫，負責集中管理所有資料
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice.js';
import tagsReducer from '../features/tags/tagsSlice.js';
import pomodoroReducer from '../features/pomodoro/pomodoroSlice.js';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    tags: tagsReducer,
    pomodoro: pomodoroReducer,
  },
});
