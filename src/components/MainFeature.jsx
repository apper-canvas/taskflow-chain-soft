import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { setTasksLoading, setTasksSuccess, setTasksError } from '../store/taskSlice'
import ApperIcon from './ApperIcon'
import { fetchTasks, createTask, updateTask, deleteTask as deleteTaskService } from '../services/taskService'

const MainFeature = () => {
  const dispatch = useDispatch()
  const { tasks, isLoading, error } = useSelector((state) => state.tasks)
  
  const [isCreating, setIsCreating] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [isDeletingTask, setIsDeletingTask] = useState(false)
  const [isUpdatingTask, setIsUpdatingTask] = useState(false)
  const [draggedTask, setDraggedTask] = useState(null)
  const [newTask, setNewTask] = useState({
    Name: '',
    title: '', 
    description: '',
    priority: 'Medium',
    dueDate: '',
    Tags: ''
  })

  // Load tasks when component mounts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        dispatch(setTasksLoading())
        const tasksData = await fetchTasks()
        
        // Transform the data to match our component's format
        const formattedTasks = tasksData.map(task => ({
          ...task,
          // Convert comma-separated tags to array if needed
          tags: task.Tags ? task.Tags.split(',').map(tag => tag.trim()) : []
        }))
        
        dispatch(setTasksSuccess(formattedTasks))
      } catch (error) {
        dispatch(setTasksError(error.message))
        toast.error('Failed to load tasks')
      }
    }
    
    loadTasks()
  }, [dispatch])

  const statuses = ['To Do', 'In Progress', 'Completed']
  const priorities = ['Low', 'Medium', 'High']

  const priorityColors = {
    Low: 'from-green-500 to-emerald-500',
    Medium: 'from-yellow-500 to-orange-500', 
    High: 'from-red-500 to-pink-500'
  }

  const statusIcons = {
    'To Do': 'Circle',
    'In Progress': 'Clock',
    'Completed': 'CheckCircle'
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    
    if (!newTask.title.trim()) {
      toast.error("Task title is required!")
      return
    }
    
    setIsCreatingTask(true)
    
    try {
      // Prepare the task data for the API
      const taskData = {
        Name: newTask.title.trim(),
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        status: 'To Do',
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        Tags: newTask.Tags
      }
      
      // Call the create task service
      const createdTask = await createTask(taskData)
      
      // Format the created task for our component
      const formattedTask = {
        ...createdTask,
        tags: createdTask.Tags ? createdTask.Tags.split(',').map(tag => tag.trim()) : []
      }
      
      // Add the task to Redux state
      dispatch({ type: 'tasks/addTask', payload: formattedTask })
      
      // Reset form and close modal
      setNewTask({ Name: '', title: '', description: '', priority: 'Medium', dueDate: '', Tags: '' })
      setIsCreating(false)
      toast.success("Task created successfully!")
    } catch (error) {
      toast.error("Failed to create task: " + error.message)
    } finally {
      setIsCreatingTask(false)
    }
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    
    if (draggedTask && draggedTask.status !== newStatus) {
      setIsUpdatingTask(true)
      
      try {
        // Call the update task service
        const updatedTask = await updateTask(draggedTask.Id, {
          ...draggedTask,
          status: newStatus
        })
        
        // Format the updated task for our component
        const formattedTask = {
          ...updatedTask,
          tags: updatedTask.Tags ? updatedTask.Tags.split(',').map(tag => tag.trim()) : []
        }
        
        // Update the task in Redux state
        dispatch({ type: 'tasks/updateTask', payload: formattedTask })
        
        toast.success(`Task moved to ${newStatus}!`)
      } catch (error) {
        toast.error("Failed to update task status: " + error.message)
      } finally {
        setIsUpdatingTask(false)
      }
    }
    setDraggedTask(null)
  }

  const deleteTask = async (taskId) => {
    setIsDeletingTask(true)
    
    try {
      // Call the delete task service
      await deleteTaskService(taskId)
      
      // Remove the task from Redux state
      dispatch({ type: 'tasks/deleteTask', payload: taskId })
      
      toast.success("Task deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete task: " + error.message)
    } finally {
      setIsDeletingTask(false)
    }
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Your
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              {" "}Task Board
            </span>
          </h3>
          <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
            Drag and drop tasks across columns to update their status. Create, organize, and track your progress.
          </p>
        </motion.div>

        {/* Create Task Button */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8 sm:mb-12"
        >
          <motion.button
            onClick={() => setIsCreating(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          className="group flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold shadow-card hover:shadow-soft transition-all duration-300 disabled:opacity-50"
          disabled={isLoading}
          >
            <ApperIcon name="Plus" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm sm:text-base">{isLoading ? 'Loading Tasks...' : 'Create New Task'}</span>
          </motion.button>
        </motion.div>

        {/* Create Task Modal */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsCreating(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-surface-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
                    Create New Task
                  </h4>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateTask} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter task title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe your task..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newTask.Tags}
                      onChange={(e) => setNewTask(prev => ({ ...prev, Tags: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="design, urgent, frontend..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="flex-1 px-6 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                      disabled={isCreatingTask}
                    >
                      {isCreatingTask ? 'Creating...' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="bg-white dark:bg-surface-800 rounded-lg p-8 shadow-lg text-center">
              <ApperIcon name="Loader" className="w-10 h-10 mx-auto mb-4 animate-spin text-primary-500" />
              <p className="text-surface-600 dark:text-surface-300">Loading tasks...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <div className="bg-white dark:bg-surface-800 rounded-lg p-8 shadow-lg text-center">
              <ApperIcon name="AlertCircle" className="w-10 h-10 mx-auto mb-4 text-red-500" />
              <p className="text-red-500 font-medium mb-2">Error loading tasks</p>
              <p className="text-surface-600 dark:text-surface-300">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg">Retry</button>
            </div>
          </div>
        ) : (
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {statuses.map((status, columnIndex) => (
            <motion.div
              key={status}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + columnIndex * 0.1 }}
              className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-3xl p-4 sm:p-6 border border-surface-200/50 dark:border-surface-700/50 shadow-card"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'To Do' ? 'bg-surface-400' :
                    status === 'In Progress' ? 'bg-primary-500' :
                    'bg-secondary-500'
                  }`} />
                  <h4 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white">
                    {status}
                  </h4>
                </div>
                <span className="bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 px-2 sm:px-3 py-1 rounded-lg text-sm font-medium">
                  {getTasksByStatus(status).length}
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4 min-h-[200px] sm:min-h-[300px]">
                <AnimatePresence>
                  {getTasksByStatus(status).map((task) => (
                    <motion.div
                      key={task.Id}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ y: -2 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className="group bg-white dark:bg-surface-700 rounded-2xl p-4 sm:p-5 shadow-soft hover:shadow-card transition-all duration-300 cursor-move border border-surface-100 dark:border-surface-600"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-semibold text-surface-900 dark:text-white text-sm sm:text-base leading-snug flex-1 pr-2">
                          {task.title}
                        </h5>
                        <button
                          onClick={() => deleteTask(task.Id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 disabled:opacity-50"
                          disabled={isDeletingTask}
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      {task.description && (
                        <p className="text-surface-600 dark:text-surface-400 text-xs sm:text-sm mb-3 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${priorityColors[task.priority]} text-white shadow-sm`}>
                            {task.priority}
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center space-x-1 text-xs text-surface-500 dark:text-surface-400">
                              <ApperIcon name="Calendar" className="w-3 h-3" />
                              <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
                            </div>
                          )}
                        </div>
                        <ApperIcon 
                          name={statusIcons[status]} 
                          className={`w-4 h-4 ${
                            status === 'Completed' ? 'text-secondary-500' : 'text-surface-400'
                          }`} 
                        />
                      </div>

                      {task.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
                          {task.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-surface-100 dark:bg-surface-600 text-surface-600 dark:text-surface-300 px-2 py-1 rounded-md text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
            ))}
          </motion.div>
        )}
        {/* Quick Stats */}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-12 lg:mt-16"
        >
          <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-surface-200/50 dark:border-surface-700/50 shadow-card">
            <h4 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white mb-4 sm:mb-6 text-center">
              Productivity Overview
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">
                    {tasks?.length || 0}
                </div>
                <div className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-1 sm:mb-2">
                    {getTasksByStatus('In Progress')?.length || 0}
                </div>
                <div className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-secondary-600 mb-1 sm:mb-2">
                    {getTasksByStatus('Completed')?.length || 0}
                </div>
                <div className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-500 mb-1 sm:mb-2">
                    {tasks?.filter(task => task.priority === 'High')?.length || 0}
                </div>
                <div className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">High Priority</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MainFeature