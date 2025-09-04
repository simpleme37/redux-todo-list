import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { startTimer, pauseTimer, resetTimer, tick } from '../features/pomodoro/pomodoroSlice';

import Pause from '../assets/icon/Pause';
import Start from '../assets/icon/Start';
import Chart from '../assets/icon/Chart';
import Restart from '../assets/icon/Restart';

export default function PomodoroPanel() {
  const dispatch = useDispatch();
  const isRunning = useSelector(state => state.pomodoro.isRunning);
  const sessionCount = useSelector(state => state.pomodoro.sessionCount);
  const timeLeft = useSelector(state => state.pomodoro.timeLeft);
  const mode = useSelector(state => state.pomodoro.mode);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');

    return `${mins}:${sec}`;
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      dispatch(tick());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, dispatch]);

  // console.log(isRunning);

  return (
    <div className="flex flex-col justify-between">
      <span className="relative flex justify-center items-center bg-white rounded-full my-2 font-display text-h2 leading-none py-3">
        {formatTime(timeLeft)}
        {mode !== 'idle' && (
          <span className="absolute -top-1 -right-1.5 text-body bg-black text-purple px-2 py-1 rounded-full transform rotate-12">
            {mode === 'focus' ? 'focus' : 'break'}
          </span>
        )}
      </span>
      <div className="flex flex-row gap-1 justify-center my-1">
        <button
          title="重置計時"
          onClick={() => {
            dispatch(resetTimer());
          }}
        >
          <Restart />
        </button>
        {/* 如果 isRunning 是 true 的話，顯示 pause 按鈕；如果 isRunning 是 false 的話，顯示 start 按鈕 */}
        <button
          title={isRunning ? '暫停計時' : '開始計時'}
          onClick={() => {
            if (isRunning) {
              dispatch(pauseTimer());
            } else {
              dispatch(startTimer());
            }
          }}
        >
          {isRunning ? <Pause /> : <Start />}
        </button>
        <button title="專注時間分析" onClick={() => {}}>
          <Chart />
        </button>
      </div>
      <p className="text-center">
        <span className="border-b-2 border-dotted">今日已經專注 {sessionCount * 25} 分鐘</span>
      </p>
    </div>
  );
}
