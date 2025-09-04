import { useState } from 'react';

import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TagPanel from './components/TagPanel';
import PomodoroPanel from './components/PomodoroPanel';

import Edit from '../src/assets/icon/Edit';
import EditOff from '../src/assets/icon/EditOff';

function App() {
  const [tagEditMode, setTagEditMode] = useState(false);

  return (
    // 頁面容器
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* 主要內容容器 */}
      <div className="container max-w-screen-lg mx-auto h-full md:h-[90vh] p-3 md:p-0">
        {/* 網格排版 */}
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-4 gap-4">
          {/* 1. 標題區塊 */}
          <div className="lg:col-span-2 lg:row-span-1 p-4 rounded-xl bg-blue flex justify-center items-center">
            <h1 className="font-display text-h1">TODO LIST</h1>
          </div>

          {/* 2. 待辦事項輸入區塊 */}
          <div className="lg:col-span-2 lg:row-span-1 p-4 rounded-xl bg-yellow flex flex-col gap-2 justify-center">
            <h2 className="text-h3 font-display">What To Do?</h2>
            <TodoInput />
          </div>

          {/* 3. 待辦清單 */}
          <div className="lg:col-span-3 lg:row-span-3 p-4 rounded-xl bg-white flex flex-col h-full min-h-0">
            <h2 className="text-h2 font-display">Todo Panel</h2>
            <TodoList />
          </div>

          {/* 4. tag 管理區塊 */}
          <div className="lg:col-span-1 lg:row-span-2 p-4 rounded-xl bg-green flex flex-col gap-2 w-full">
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
          <div className="lg:col-span-1 lg:row-span-1 p-4 rounded-xl bg-purple w-full">
            <h2 className="text-h3 font-display">Pomodoro</h2>
            <PomodoroPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
