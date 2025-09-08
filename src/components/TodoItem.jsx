import { useDrop } from 'react-dnd';
import { ItemTypes } from '@/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteTodo,
  toggleTodo,
  assignTagToTodo,
  removeTagFromTodo,
} from '@/features/todos/todosSlice';
import clsx from 'clsx';
import Swal from 'sweetalert2';

import Heart from '@/assets/icon/Heart';
import HeartFill from '@/assets/icon/HeartFill';
import TrashCan from '@/assets/icon/TrashCan';
import Cancel from '@/assets/icon/Cancel';

export default function TodoItem({
  todo,
  editingId,
  editingText,
  setEditingId,
  setEditingText,
  handleUpdate,
  handleEdit,
  formatDate,
}) {
  const dispatch = useDispatch();
  const tags = useSelector(state => state.tags);

  // 找出 todo 們對應的標籤物件
  const matchedTags = todo.tagIds.map(id => tags.find(tag => tag.id === id)).filter(Boolean);

  // 設定拖放行為
  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.TAG,
    drop: (item) => {
      const { tagId } = item;
      // console.log('Tag dropped:', tagId);

      // 限制：每個待辦最多 3 個標籤
      if (todo.tagIds.length >= 3) {
        Swal.fire({
          icon: 'warning',
          title: '標籤已達上限',
          text: '每個待辦事項最多只能有 3 個標籤',
          confirmButtonText: 'ok',
        });
        return;
      }

      dispatch(assignTagToTodo({ todoId: todo.id, tagId }));

      console.log(todo);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <li
      key={todo.id}
      ref={dropRef}
      className={clsx(
        'bg-blue/30 flex gap-2 px-3 py-1.5 rounded-full mb-1',
        isOver && 'bg-blue/50'
      )}
    >
      {/* 勾選框 */}
      <label className="sr-only">Toggle Done</label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => dispatch(toggleTodo(todo.id))}
        className="hidden"
      />
      <button onClick={() => dispatch(toggleTodo(todo.id))}>
        {todo.done ? (
          <HeartFill className="text-dark-blue" />
        ) : (
          <Heart
            className="text-dark-blue"
            pathClassName="transition-colors hover:fill-dark-blue/40"
          />
        )}
      </button>

      {/* 項目文字與標籤 */}
      <div className="flex flex-col md:flex-row gap-1 md:gap-0 flex-1">
        {/* 項目文字、編輯中與否 */}
        {editingId === todo.id ? (
          <input
            type="text"
            value={editingText}
            onChange={e => {
              setEditingText(e.target.value);
            }}
            onBlur={() => {
              handleUpdate(todo.id);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleUpdate(todo.id);
              }
              if (e.key === 'Escape') {
                setEditingId(null);
                setEditingText('');
              }
            }}
            autoFocus
            className="flex-1 min-w-0"
          />
        ) : (
          <div className="flex w-full justify-between">
            <span
              style={{
                textDecoration: todo.done ? 'line-through' : 'none',
                cursor: 'pointer',
                marginRight: '8px',
                color: todo.done ? 'grey' : 'black',
              }}
              onClick={() => {
                handleEdit(todo);
              }}
              className="line-clamp-1"
            >
              {todo.text}
            </span>
          </div>
        )}

        {/* 標籤 */}
        <div className="flex flex-row gap-2">
          {matchedTags.map(tag => (
            <span
              key={tag.id}
              className="relative flex items-center gap-1 px-2 rounded-full cursor-pointer text-nowrap bg-white group"
            >
              <span
                className="w-[10px] h-[10px] rounded-full inline-block"
                style={{ backgroundColor: tag.color }}
              ></span>
              {/* Hover 時出現取消按鈕 */}
              <button
                className="absolute md:hidden group-hover:block bg-black rounded-full -top-1 -right-2"
                onClick={() => {
                  dispatch(removeTagFromTodo({ todoId: todo.id, tagId: tag.id }));
                }}
              >
                <Cancel size={16} color="white" />
              </button>
              {tag.text}
            </span>
          ))}
        </div>
      </div>

      {/* 完成日期時間 */}
      {todo.completedAt && (
        <span className="text-medium-gray text-nowrap">
          {formatDate(new Date(todo.completedAt))}
        </span>
      )}

      {/* 垃圾桶 */}
      <button
        onClick={() => dispatch(deleteTodo(todo.id))}
        className="text-medium-gray text-nowrap"
      >
        <TrashCan />
      </button>
    </li>
  );
}
