import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import Todo from './Todo';
import { useAuth } from '../contexts/AuthContext';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTodos = async () => {
      const q = query(
        collection(db, 'todos'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const todosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todosData);
      setLoading(false);
    };

    fetchTodos();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        text: newTodo,
        completed: false,
        timestamp: new Date(),
        userId: user.uid
      });

      setTodos([...todos, {
        id: docRef.id,
        text: newTodo,
        completed: false,
        userId: user.uid
      }]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleEdit = async (id, newText) => {
    try {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, {
        text: newText
      });

      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-offset-0 transition-colors duration-200"
                />
                <button
                  type="submit"
                  className="h-12 px-6 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200 flex-shrink-0 shadow-lg shadow-primary/20"
                >
                  Add Task
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {todos.map(todo => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
              {todos.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No tasks yet. Add one above! ✨
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
