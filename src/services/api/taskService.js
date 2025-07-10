import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

export const getAllTasks = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...tasks];
};

export const getTaskById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  const task = tasks.find(t => t.Id === parseInt(id));
  if (!task) {
    throw new Error("Task not found");
  }
  return { ...task };
};

export const createTask = async (taskData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newTask = {
    ...taskData,
    Id: Math.max(...tasks.map(t => t.Id)) + 1
  };
  
  tasks.push(newTask);
  return { ...newTask };
};

export const updateTask = async (id, taskData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const index = tasks.findIndex(t => t.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Task not found");
  }
  
  tasks[index] = { ...tasks[index], ...taskData };
  return { ...tasks[index] };
};

export const deleteTask = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = tasks.findIndex(t => t.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Task not found");
  }
  
  tasks.splice(index, 1);
  return true;
};