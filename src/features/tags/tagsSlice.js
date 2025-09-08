import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_TAGS = [
  { id: 666, text: '標籤 A', color: '#ee9a9c' },
  { id: 888, text: '標籤 B', color: '#ffa73b' },
];

const loadFromLocalStorage = () => {
  // 先從 localStorage 取取看資料
  const raw = localStorage.getItem('todoApp.tags');
  // 假如無資料、"undefined"、"null"、空字串 -> 都回預設值
  if (!raw || raw === 'undefined' || raw === 'null') return DEFAULT_TAGS;
  // 正常取值處理成 JSON
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_TAGS;
  } catch {
    localStorage.removeItem('todoApp.tags');
    return DEFAULT_TAGS;
  }
};

const predefinedColors = [
  '#ffa73b', // orange
  '#ededbd', // yellow
  '#cad7f0', // blue
  '#cbf0d4', // green
  '#ee9a9c', // red
  '#d0c0f2', // purple
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * predefinedColors.length);
  return predefinedColors[randomIndex];
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState: loadFromLocalStorage(),
  reducers: {
    addTag: (state, action) => {
      const newTag = {
        id: Date.now(),
        text: action.payload,
        color: action.payload.color || getRandomColor(),
      };
      state.push(newTag);
    },
    deleteTag: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    },
    updateTag: (state, action) => {
      // console.log(action.payload);
      const { id, text } = action.payload;
      const tag = state.find(t => t.id === id);
      if (tag) {
        tag.text = text;
      }
    },
  },
});

export const { addTag, deleteTag, updateTag } = tagsSlice.actions;

export default (state, action) => {
  const newState = tagsSlice.reducer(state, action);

  try {
    localStorage.setItem('todoApp.tags', JSON.stringify(newState));
  } catch (err) {
    console.error('Failed to save tags', err);
  }

  return newState;
};
