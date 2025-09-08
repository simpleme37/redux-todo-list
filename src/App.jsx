import { useState } from 'react';
import { useSelector } from 'react-redux';

import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import TagPanel from '@/components/TagPanel';
import PomodoroPanel from '@/components/PomodoroPanel';

import Edit from '@/assets/icon/Edit';
import EditOff from '@/assets/icon/EditOff';

function App() {
  const [tagEditMode, setTagEditMode] = useState(false);
  const mode = useSelector(state => state.pomodoro.mode);

  return (
    // 頁面容器
    <div className="min-h-screen flex items-center justify-center">
      {/* 主要內容容器 */}
      <div className="container max-w-screen-lg mx-auto h-full md:h-[90vh] p-3 lg:p-0">
        {/* Grid 排版 */}
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-4">
          {/* 1. 標題區塊 */}
          <div className="md:col-span-2 md:row-span-1 p-4 rounded-xl bg-blue flex justify-center items-center">
            <h1 className="font-display text-h1">TODO LIST</h1>
          </div>

          {/* 2. 待辦事項輸入區塊 */}
          <div className="md:col-span-2 md:row-span-1 p-4 rounded-xl bg-yellow flex flex-col gap-2 justify-center">
            <h2 className="text-h3 font-display">What To Do?</h2>
            <TodoInput />
          </div>

          {/* 3. 待辦清單 */}
          <div className="md:col-span-3 md:row-span-3 p-4 rounded-xl bg-white flex flex-col h-full min-h-0">
            <h2 className="text-h3 lg:text-h2 font-display">Todo Panel</h2>
            <TodoList />
          </div>

          {/* 4. tag 管理區塊 */}
          <div className="md:col-span-1 md:row-span-2 p-4 rounded-xl bg-green flex flex-col gap-2 overflow-hidden min-h-0">
            <h2 className="text-h3 font-display flex justify-between items-center">
              Tag
              <button
                onClick={() => {
                  setTagEditMode(prev => !prev);
                }}
              >
                {tagEditMode ? <EditOff /> : <Edit />}
              </button>
            </h2>
            <TagPanel tagEditMode={tagEditMode} />
          </div>

          {/* 5. 番茄鐘區塊 */}
          <div className="relative md:col-span-1 md:row-span-1 p-4 rounded-xl bg-purple flex flex-col min-h-0">
            <h2 className="text-h3 font-display line-clamp-1">Pomodoro</h2>
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              <PomodoroPanel />
            </div>
            {mode !== 'idle' && (
              <span className="font-display absolute -top-1 -right-1 text-body bg-black text-purple px-2 py-1 rounded-full transform rotate-12">
                {mode === 'focus' ? 'focus' : 'break'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
