import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = () => {
  const data = localStorage.getItem('todoApp.pomodoro');
  return data
    ? JSON.parse(data)
    : {
        isRunning: false,
        mode: 'idle', // idle | focus | short_break | long_break
        timeLeft: 25 * 60, // 25 分鐘
        focusDuration: 25 * 60,
        shortBreakDuration: 5 * 60,
        longBreakDuration: 15 * 60,
        sessionCount: 1,
        history: [],
      };
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState: loadFromLocalStorage(),
  reducers: {
    startTimer: state => {
      state.isRunning = true;
      if (state.mode === 'idle') {
        state.mode = 'focus';
        state.timeLeft = state.focusDuration;
      }
    },
    pauseTimer: state => {
      state.isRunning = false;
    },
    resetTimer: state => {
      state.isRunning = false;
      state.mode = 'idle';
      state.timeLeft = state.focusDuration;
    },
    tick: state => {
      if (state.timeLeft < 0) state.timeLeft = 0;
      // timeLeft 大於 0，只扣秒就結束
      if (state.isRunning && state.timeLeft > 0) {
        state.timeLeft -= 1;
      }

      // timeLeft 剛好等於 0，做一次結算、切換
      if (state.timeLeft === 0) {
        state.isRunning = false;

        const duration =
          state.mode === 'focus'
            ? state.focusDuration
            : state.mode === 'short_break'
              ? state.shortBreakDuration
              : state.longBreakDuration;

        state.history.push({
          mode: state.mode,
          duration,
          timeStamp: Date.now(),
        });

        // 限制歷史紀錄的筆數
        if (state.history.length > 200) {
          state.history.splice(0, state.history.length - 200);
        }

        if (state.mode === 'focus') {
          // 專注 -> 休息
          state.sessionCount += 1;
          state.mode = state.sessionCount % 4 === 0 ? 'long_break' : 'short_break';
          state.timeLeft =
            state.mode === 'short_break' ? state.shortBreakDuration : state.longBreakDuration;
        } else {
          // 休息 -> 專注
          state.mode = 'focus';
          state.timeLeft = state.focusDuration;
        }

        state.isRunning = true;
        return;
      }
    },
  },
});

export const { startTimer, pauseTimer, resetTimer, tick } = pomodoroSlice.actions;

export default (state, action) => {
  const newState = pomodoroSlice.reducer(state, action);

  localStorage.setItem('todoApp.pomodoro', JSON.stringify(newState));

  return newState;
};
