import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';
import Cancel from '../assets/icon/Cancel';
import { deleteTagAndCleanTodos } from '../actions/tagActions';

export default function TagItem({
  tag,
  tagEditMode,
  editingId,
  editingText,
  setEditingId,
  setEditingText,
  handleEdit,
  handleUpdate,
  handleDelete,
}) {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.TAG,
      item: { tagId: tag.id }, // 拖曳時要傳的資料
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );

  // 只有在非編輯模式下才綁定 dragRef
  const dragElementRef = tagEditMode ? null : dragRef;

  return (
    <div className="relative" key={tag.id}>
      {editingId === tag.id ? (
        <div className="tag">
          <span
            className="w-[10px] h-[10px] rounded-full inline-block"
            style={{ backgroundColor: tag.color }}
          ></span>
          <input
            type="text"
            value={editingText}
            size={editingText.length || 1}
            onChange={e => {
              setEditingText(e.target.value);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleUpdate(tag.id);
              }
              if (e.key === 'Escape') {
                setEditingId(null);
                setEditingText('');
              }
            }}
            onBlur={() => handleUpdate(tag.id)}
          />
        </div>
      ) : (
        <span
          ref={dragElementRef}
          className="tag gap-1 cursor-none"
          style={{ opacity: isDragging ? 0.5 : 1 }}
          onClick={() => tagEditMode && handleEdit(tag)}
        >
          <span
            className="w-[10px] h-[10px] rounded-full inline-block"
            style={{ backgroundColor: tag.color }}
          ></span>
          {tag.text}
        </span>
      )}

      {tagEditMode && (
        <button
          className="bg-black rounded-full absolute -top-1.5 -right-1"
          onClick={() => {
            handleDelete(tag.id);
          }}
        >
          <Cancel size={16} color="white" />
        </button>
      )}
    </div>
  );
}
