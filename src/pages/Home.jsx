import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-surface-900/80 border-b border-surface-200 dark:border-surface-700"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-soft">
                <ApperIcon name="CheckSquare" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">
                  Organize. Prioritize. Achieve.
                </p>
              </div>
            </motion.div>

            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-200 shadow-soft"
            >
              <ApperIcon 
                name={isDarkMode ? "Sun" : "Moon"} 
                className="w-5 h-5 sm:w-6 sm:h-6" 
              />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Transform Your
              <span className="block bg-gradient-to-r from-primary-500 via-accent to-secondary-500 bg-clip-text text-transparent">
                Productivity
              </span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto leading-relaxed">
              Experience task management like never before with our intuitive Kanban board and powerful organization tools.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20"
          >
            {[
              { icon: "Target", label: "Tasks Completed", value: "2,847", color: "from-secondary-500 to-secondary-600" },
              { icon: "Users", label: "Active Users", value: "15,429", color: "from-primary-500 to-primary-600" },
              { icon: "Clock", label: "Time Saved", value: "1,240h", color: "from-accent to-orange-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl blur-xl" 
                     style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}></div>
                <div className="relative bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-card border border-surface-200/50 dark:border-surface-700/50">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6 shadow-soft`}>
                    <ApperIcon name={stat.icon} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-surface-600 dark:text-surface-400">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Feature */}
      <MainFeature />

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-8 sm:py-12 border-t border-surface-200 dark:border-surface-700 bg-white/50 dark:bg-surface-900/50 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-surface-800 dark:text-surface-200">TaskFlow</span>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              © 2024 TaskFlow. Designed for productivity enthusiasts.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home