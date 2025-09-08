import { useDrag } from 'react-dnd';
import { ItemTypes } from '@/constants';
import Cancel from '@/assets/icon/Cancel';

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
  // 使用 react-dnd 的 useDrag 建立「可拖曳的標籤」：
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.TAG, // 拖曳物件的類型
      item: { tagId: tag.id }, // 拖曳時要傳的資料
      // 監聽拖曳狀態
      collect: monitor => ({
        isDragging: monitor.isDragging(), 
      }),
    }),
    []
  );

  // 如果目前在「標籤編輯模式」下，就不允許拖曳 → 不綁定 dragRef
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
