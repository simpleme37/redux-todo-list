import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  startTimer,
  pauseTimer,
  resetTimer,
  skipBreak,
  tick,
} from '@/features/pomodoro/pomodoroSlice';

import Swal from 'sweetalert2';
import ReactDOM from 'react-dom/client';
import FocusTimeChart from '@/components/FocusTimeChart';
import { getWeekFocusMinutes } from '@/utils/pomodoroAnalytics';
import { maxWeekOffsetFromHistory, formatWeekRange } from '@/utils/pomodoroAnalytics';

import Pause from '@/assets/icon/Pause';
import Start from '@/assets/icon/Start';
import Chart from '@/assets/icon/Chart';
import Restart from '@/assets/icon/Restart';
import Skip from '@/assets/icon/Skip';

function showFocusChart(history, weekOffset = 0) {
  let root;
  let offset = 0;
  const maxOffset = maxWeekOffsetFromHistory(history, 1);

  const html = `
    <div id="focus-time-chart" style="width:100%;max-width:720px;margin:0 auto;"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;gap:8px;">
      <button id="prev-week" class="swal2-styled">⟵ 上一週</button>
      <span id="week-range" style="font-weight:600;"></span>
      <button id="next-week" class="swal2-styled">下一週⟶</button>
    </div>
  `;

  const render = () => {
    const host = document.getElementById('focus-time-chart');
    const days = getWeekFocusMinutes(history, offset, 1);
    // 第一次進來時建立 root
    if (!root) root = ReactDOM.createRoot(host);
    root.render(<FocusTimeChart days={days} />);

    // 更新週範圍文字與按鈕狀態
    const range = document.getElementById('week-range');
    const prevBtn = document.getElementById('prev-week');
    const nextBtn = document.getElementById('next-week');
    if (range) range.textContent = formatWeekRange(offset, 1);
    if (prevBtn) prevBtn.disabled = offset >= maxOffset; // 不能比最舊更早
    if (nextBtn) nextBtn.disabled = offset <= 0; // 不能比本週更新
  };

  Swal.fire({
    title: '每週專注時間',
    html,
    showConfirmButton: true,
    confirmButtonText: '關閉',
    didOpen: () => {
      // 綁定按鈕事件
      const prevBtn = document.getElementById('prev-week');
      const nextBtn = document.getElementById('next-week');

      prevBtn?.addEventListener('click', () => {
        if (offset < maxOffset) {
          offset += 1;
          render();
        }
      });
      nextBtn?.addEventListener('click', () => {
        if (offset > 0) {
          offset -= 1;
          render();
        }
      });

      render(); // 初次渲染（本週）
    },
    willClose: () => {
      root?.unmount();
    },
  });
}

export default function PomodoroPanel() {
  const dispatch = useDispatch();
  const isRunning = useSelector(state => state.pomodoro.isRunning);
  const sessionCount = useSelector(state => state.pomodoro.sessionCount);
  const timeLeft = useSelector(state => state.pomodoro.timeLeft);
  const mode = useSelector(state => state.pomodoro.mode);
  const history = useSelector(state => state.pomodoro.history);

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
      <span className="relative flex justify-center items-center bg-white rounded-full mt-3 mb-1 font-display text-h2 leading-none py-3">
        {formatTime(timeLeft)}
      </span>
      <div className="flex flex-row gap-1 justify-center my-1">
        {/* 重置計時 */}
        <button
          title="重置計時"
          onClick={() => {
            dispatch(resetTimer());
          }}
        >
          <Restart />
        </button>

        {/* 開始與暫停：如果 isRunning 是 true 的話，顯示 pause 按鈕；如果 isRunning 是 false 的話，顯示 start 按鈕 */}
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

        {/* 跳過 */}
        {(mode === 'short_break' || mode === 'long_break') && (
          <button
            title="跳過此階段"
            onClick={() => {
              dispatch(skipBreak());
            }}
          >
            <Skip />
          </button>
        )}

        {/* 圖表 */}
        <button title="專注時間分析" onClick={() => showFocusChart(history, 1)}>
          <Chart />
        </button>
      </div>
      <p className="text-center">
        <span className="border-b-2 border-dotted">今日已經專注 {sessionCount * 25} 分鐘</span>
      </p>
    </div>
  );
}
