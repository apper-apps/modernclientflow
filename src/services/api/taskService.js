import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];
let nextTimeLogId = 100;

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

export const updateTaskStatus = async (id, status) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = tasks.findIndex(t => t.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Task not found");
  }
  
  tasks[index] = { ...tasks[index], status };
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

export const startTaskTimer = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = tasks.findIndex(t => t.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Task not found");
  }

  const now = new Date().toISOString();
  
  if (!tasks[index].timeTracking) {
    tasks[index].timeTracking = {
      totalTime: 0,
      activeTimer: null,
      timeLogs: []
    };
  }

  if (tasks[index].timeTracking.activeTimer) {
    throw new Error("Timer already running for this task");
  }

  tasks[index].timeTracking.activeTimer = {
    Id: tasks[index].Id,
    startTime: now
  };

  return { ...tasks[index].timeTracking.activeTimer };
};

export const stopTaskTimer = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = tasks.findIndex(t => t.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Task not found");
  }

  if (!tasks[index].timeTracking?.activeTimer) {
    throw new Error("No active timer for this task");
  }

  const now = new Date().toISOString();
  const startTime = new Date(tasks[index].timeTracking.activeTimer.startTime);
  const endTime = new Date(now);
  const duration = endTime.getTime() - startTime.getTime();

  const timeLog = {
    Id: nextTimeLogId++,
    startTime: tasks[index].timeTracking.activeTimer.startTime,
    endTime: now,
    duration: duration,
    date: startTime.toISOString().split('T')[0]
  };

  tasks[index].timeTracking.timeLogs.push(timeLog);
  tasks[index].timeTracking.totalTime += duration;
  tasks[index].timeTracking.activeTimer = null;

  return { ...timeLog };
};

export const getTaskTimeLogs = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const task = tasks.find(t => t.Id === parseInt(id));
  if (!task) {
    throw new Error("Task not found");
  }

  return task.timeTracking?.timeLogs || [];
};