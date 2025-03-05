import { useState, useEffect } from 'react'
import { db } from './firebase'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import Todo from './components/Todo'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch todos from Firebase
  useEffect(() => {
    const fetchTodos = async () => {
      const querySnapshot = await getDocs(collection(db, 'todos'))
      const todosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTodos(todosData)
      setLoading(false)
    }

    fetchTodos()
  }, [])

  // Add new todo
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        text: newTodo,
        completed: false,
        timestamp: new Date()
      })

      setTodos([...todos, {
        id: docRef.id,
        text: newTodo,
        completed: false
      }])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  // Edit todo
  const handleEdit = async (id, newText) => {
    try {
      const todoRef = doc(db, 'todos', id)
      await updateDoc(todoRef, {
        text: newText
      })

      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id))
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-indigo-600 px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            Todo List
          </h1>
        </div>

        <div className="p-6 md:p-8">
          {/* Add Todo Form */}
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
                Add
              </button>
            </div>
          </form>

          {/* Todo List */}
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
  )
}

export default App
