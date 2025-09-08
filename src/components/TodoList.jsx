import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearTodo, updateTodo } from '@/features/todos/todosSlice';
import TodoItem from '@/components/TodoItem';
import clsx from 'clsx';

import FaceSurprise from '@/assets/icon/FaceSurprise';

export default function TodoList() {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();
  
  const [filter, setFilter] = useState('all'); // all、active、completed
  const [editingId, setEditingId] = useState();
  const [editingText, setEditingText] = useState();

  // 清空所有 todo
  const handleClear = () => {
    dispatch(clearTodo());
  };

  // 將某筆 todo 切換成「編輯模式」
  const handleEdit = todo => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  // 確認並更新 todo 內容
  const handleUpdate = id => {
    if (!editingText.trim()) {
      setEditingId(null);
      setEditingText('');
      return;
    }

    dispatch(updateTodo({ id, text: editingText }));
    setEditingId(null);
    setEditingText('');
  };

  // 根據目前 filter 狀態過濾 todo
  const filterTodos = todos.filter(todo => {
    if (filter === 'all') {
      return true;
    }
    if (filter === 'active') {
      return !todo.done;
    }
    if (filter === 'completed') {
      return todo.done;
    }
  });

  // 排序 todo：未完成在上面，已完成在下面
  const sortedTodos = filterTodos.slice().sort((a, b) => {
    return Number(a.done) - Number(b.done);
  });

  // 處理日期格式：去掉秒數
  const formatDate = function (date) {
    return date.toLocaleString('zh-TW', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {todos.length !== 0 ? (
        <div className="flex flex-col h-full min-h-0 gap-2">
          {/* 狀態篩選按鈕 */}
          <div className="flex justify-between mt-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilter('all');
                }}
                className={clsx(
                  'btn-tab',
                  filter === 'all' ? 'btn-tab-active' : 'btn-tab-inactive'
                )}
              >
                全部
              </button>
              <button
                onClick={() => {
                  setFilter('active');
                }}
                className={clsx(
                  'btn-tab',
                  filter === 'active' ? 'btn-tab-active' : 'btn-tab-inactive'
                )}
              >
                未完成
              </button>
              <button
                onClick={() => {
                  setFilter('completed');
                }}
                className={clsx(
                  'btn-tab',
                  filter === 'completed' ? 'btn-tab-active' : 'btn-tab-inactive'
                )}
              >
                已完成
              </button>
            </div>

            <button onClick={handleClear} className="btn-delete text-end mt-1">
              清除全部
            </button>
          </div>

          <ul className="flex-1 min-h-0 overflow-y-auto py-2 pr-2">
            {/* 清單內可以捲動 */}
            {sortedTodos.map(todo => {
              return (
                <TodoItem
                  todo={todo}
                  editingId={editingId}
                  editingText={editingText}
                  setEditingId={setEditingId}
                  setEditingText={setEditingText}
                  handleUpdate={handleUpdate}
                  handleEdit={handleEdit}
                  formatDate={formatDate}
                />
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="text-medium-gray flex flex-col gap-1 justify-center h-full items-center p-6 lg:p-0">
          <FaceSurprise size={32} />
          <p>目前沒有待辦事項</p>
        </div>
      )}
    </>
  );
}
