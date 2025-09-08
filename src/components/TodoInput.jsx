import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '@/features/todos/todosSlice';
import Swal from 'sweetalert2';

export default function TodoInput() {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  // 新增待辦事項
  const handleAdd = () => {
    if (!text.trim()) {
      setError('請輸入待辦事項');
      return;
    }
    if (text.length > 100) {
      setError('待辦事項不得超過100字');
      return;
    }

    dispatch(addTodo(text)); // 派送 addTodo 這個 action

    Swal.fire({
      title: '新增成功',
      icon: 'success',
      confirmButtonText: 'Cool',
    }).then(() => {
      setText(''); // 加完清空輸入框
      setError('');
      inputRef.current.focus();
    });
  };

  // 鍵盤事件：按下 Enter 觸發新增
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  // 輸入框文字改變時更新狀態，並清除錯誤訊息
  const handleChange = e => {
    setText(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className='flex flex-col sm:flex-row gap-2'>
      <div className='w-full'>
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="請輸入待辦事項"
          maxLength={30}
          ref={inputRef}
          className='bg-white w-full rounded-full px-4 py-2 focus:ring-offset-0'
        />
        {error && <span>{error}</span>}
      </div>
      <button onClick={handleAdd} disabled={!text.trim()} className='font-display bg-black text-yellow rounded-full py-1 sm:py-0 px-4'>
        Add Todo
      </button>
    </div>
  );
}
