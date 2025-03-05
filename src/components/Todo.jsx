import React, { useState } from 'react';

const Todo = ({ todo, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing && editedText.trim()) {
      onEdit(todo.id, editedText);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="group bg-gray-50 hover:bg-white border-2 border-gray-100 rounded-xl p-4 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center gap-4">
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="flex-1 h-10 px-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-offset-0 transition-colors duration-200"
            autoFocus
          />
        ) : (
          <span className={`flex-1 text-gray-900 text-lg ${todo.completed ? 'line-through text-gray-400' : ''}`}>
            {todo.text}
          </span>
        )}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEdit}
            className={`h-10 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isEditing
                ? 'bg-secondary text-white shadow-lg shadow-secondary/20 hover:bg-secondary/90'
                : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90'
            }`}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="h-10 px-4 rounded-lg text-sm font-semibold bg-white border-2 border-danger text-danger hover:bg-danger hover:text-white transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Todo; 
