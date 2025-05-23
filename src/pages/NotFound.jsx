import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-lg w-full"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-card"
        >
          <ApperIcon name="AlertTriangle" className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </motion.div>
        
        <h1 className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-semibold text-surface-800 dark:text-surface-200 mb-4">
          Task Not Found
        </h2>
        
        <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 sm:mb-12">
          It looks like this page went off-task. Let's get you back to your productivity dashboard.
        </p>
        
        <Link 
          to="/"
          className="group inline-flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-card hover:shadow-soft transition-all duration-300 transform hover:scale-105"
        >
          <ApperIcon name="Home" className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Back to TaskFlow</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound