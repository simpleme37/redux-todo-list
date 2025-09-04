import { deleteTag } from '../features/tags/tagsSlice';
import { removeTagFromAllTodos } from '../features//todos/todosSlice';

export const deleteTagAndCleanTodos = tagId => dispatch => {
  dispatch(deleteTag(tagId));
  dispatch(removeTagFromAllTodos(tagId));
};
