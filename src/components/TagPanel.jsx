import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTag, deleteTag, updateTag } from '../features/tags/tagsSlice';
import { deleteTagAndCleanTodos } from '../actions/tagActions';
import TagItem from './TagItem';
import Swal from 'sweetalert2';

export default function TagPanel({ tagEditMode }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const dispatch = useDispatch();
  const tags = useSelector(state => state.tags);

  // 新增 Tag
  const handleAdd = () => {
    if (!text.trim()) {
      setError('請輸入標籤文字');
      return;
    }
    if (text.length > 100) {
      setError('標籤文字不得超過 10 字');
      return;
    }

    dispatch(addTag(text)); // 派送 addTag 這個 action

    Swal.fire({
      title: '新增成功',
      icon: 'success',
      confirmButtonText: 'Cool',
    }).then(() => {
      setText(''); // 加完清空輸入框
      setError('');
      // inputRef.current.focus();
    });
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const handleChange = e => {
    setText(e.target.value);
    if (error) {
      setError('');
    }
  };

  // 刪除 Tag
  const handleDelete = id => {
    Swal.fire({
      title: '確定刪除此標籤?',
      icon: 'question',
      confirmButtonText: '確定',
      showCancelButton: true,
      cancelButtonText: '取消',
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(deleteTagAndCleanTodos(id));
      }
    });
  };

  // 編輯 Tag
  const handleEdit = tag => {
    setEditingId(tag.id);
    setEditingText(tag.text);
  };

  const handleUpdate = id => {
    if (!editingText.trim()) {
      setEditingId(null);
      setEditingText('');
      return;
    }

    if (editingText.length > 10) {
      Swal.fire('字數過長', '標籤不得超過 10 字', 'warning');
      return;
    }

    dispatch(updateTag({ id, text: editingText }));
    setEditingId(null);
    setEditingText('');
  };

  return (
    <>
      <div className="flex flex-col gap-2 mb-2">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="請輸入標籤名稱"
          maxLength={10}
          className="w-full bg-white rounded-full px-4 py-1"
        />
        <button onClick={handleAdd} className="font-display bg-black text-green w-full rounded-full py-1">
          Add Tag
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <TagItem
            key={tag.id}
            tag={tag}
            tagEditMode={tagEditMode}
            editingId={editingId}
            editingText={editingText}
            setEditingId={setEditingId}
            setEditingText={setEditingText}
            handleEdit={handleEdit}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </>
  );
}
