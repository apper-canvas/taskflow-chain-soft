// Task service for handling all task-related API operations

// Fetch all tasks with optional filters
export const fetchTasks = async () => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Define fields to fetch based on the task2 table definition
    const fields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'title', 'description', 
      'status', 'priority', 'dueDate'
    ];

    // Fetch records from the task2 table
    const response = await apperClient.fetchRecords('task2', {
      fields,
      orderBy: [
        {
          fieldName: 'ModifiedOn',
          SortType: 'DESC'
        }
      ]
    });

    // Return the task data
    return response.data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Format tags as a comma-separated string if it's an array
    let formattedTask = { ...taskData };
    if (Array.isArray(formattedTask.Tags)) {
      formattedTask.Tags = formattedTask.Tags.join(',');
    }

    // Create the task record
    const response = await apperClient.createRecord('task2', {
      records: [formattedTask]
    });

    // Check if creation was successful
    if (response && response.success && response.results && response.results.length > 0) {
      const createdTask = response.results[0].data;
      return createdTask;
    } else {
      throw new Error('Failed to create task');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Format tags as a comma-separated string if it's an array
    let formattedTask = { ...taskData };
    if (Array.isArray(formattedTask.Tags)) {
      formattedTask.Tags = formattedTask.Tags.join(',');
    }

    // Add the ID to the task data
    formattedTask.Id = taskId;

    // Update the task record
    const response = await apperClient.updateRecord('task2', {
      records: [formattedTask]
    });

    // Check if update was successful
    if (response && response.success && response.results && response.results.length > 0) {
      const updatedTask = response.results[0].data;
      return updatedTask;
    } else {
      throw new Error('Failed to update task');
    }
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Delete the task record
    const response = await apperClient.deleteRecord('task2', {
      RecordIds: [taskId]
    });

    // Check if deletion was successful
    if (response && response.success) {
      return true;
    } else {
      throw new Error('Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};