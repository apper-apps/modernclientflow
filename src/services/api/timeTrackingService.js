import { startTaskTimer, stopTaskTimer, getTaskTimeLogs } from "@/services/api/taskService";
import { getAllTasks } from "@/services/api/taskService";

export const startTimer = async (taskId) => {
  try {
    const timerData = await startTaskTimer(taskId);
    return timerData;
  } catch (error) {
    throw new Error(`Failed to start timer: ${error.message}`);
  }
};

export const stopTimer = async (taskId) => {
  try {
    const timeLog = await stopTaskTimer(taskId);
    return timeLog;
  } catch (error) {
    throw new Error(`Failed to stop timer: ${error.message}`);
  }
};

export const getActiveTimer = async (taskId) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const tasks = await getAllTasks();
  const task = tasks.find(t => t.Id === parseInt(taskId));
  
  if (!task) {
    throw new Error("Task not found");
  }

  return task.timeTracking?.activeTimer || null;
};

export const getTimeLogs = async (taskId) => {
  try {
    const timeLogs = await getTaskTimeLogs(taskId);
    return timeLogs;
  } catch (error) {
    throw new Error(`Failed to get time logs: ${error.message}`);
  }
};

export const getProjectTimeTracking = async (projectId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const tasks = await getAllTasks();
    const projectTasks = tasks.filter(t => t.projectId === String(projectId));
    
    let totalTime = 0;
    let activeTimers = 0;
    let totalEntries = 0;
    const timeLogs = [];

    projectTasks.forEach(task => {
      if (task.timeTracking) {
        totalTime += task.timeTracking.totalTime || 0;
        
        if (task.timeTracking.activeTimer) {
          activeTimers++;
        }
        
        if (task.timeTracking.timeLogs) {
          totalEntries += task.timeTracking.timeLogs.length;
          timeLogs.push(...task.timeTracking.timeLogs.map(log => ({
            ...log,
            taskId: task.Id,
            taskTitle: task.title
          })));
        }
      }
    });

    // Sort time logs by date (newest first)
    timeLogs.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));

    return {
      totalTime,
      activeTimers,
      totalEntries,
      timeLogs: timeLogs.slice(0, 10) // Return last 10 entries
    };
  } catch (error) {
    throw new Error(`Failed to get project time tracking: ${error.message}`);
  }
};

export const getAllTimeTracking = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const tasks = await getAllTasks();
    
    const summary = {
      totalTime: 0,
      activeTimers: 0,
      totalEntries: 0,
      taskBreakdown: []
    };

    tasks.forEach(task => {
      if (task.timeTracking) {
        summary.totalTime += task.timeTracking.totalTime || 0;
        
        if (task.timeTracking.activeTimer) {
          summary.activeTimers++;
        }
        
        if (task.timeTracking.timeLogs) {
          summary.totalEntries += task.timeTracking.timeLogs.length;
        }

        if (task.timeTracking.totalTime > 0 || task.timeTracking.activeTimer) {
          summary.taskBreakdown.push({
            taskId: task.Id,
            taskTitle: task.title,
            projectId: task.projectId,
            totalTime: task.timeTracking.totalTime || 0,
            hasActiveTimer: !!task.timeTracking.activeTimer,
            entryCount: task.timeTracking.timeLogs?.length || 0
          });
        }
      }
    });

    // Sort by total time descending
    summary.taskBreakdown.sort((a, b) => b.totalTime - a.totalTime);

    return summary;
  } catch (error) {
    throw new Error(`Failed to get all time tracking data: ${error.message}`);
  }
};