import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setTasksSuccess: (state, action) => {
      state.tasks = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setTasksError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.Id === action.payload.Id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.Id !== action.payload);
    },
  },
});

export const { 
  setTasksLoading, 
  setTasksSuccess, 
  setTasksError,
  addTask,
  updateTask,
  deleteTask
} = taskSlice.actions;

export default taskSlice.reducer;