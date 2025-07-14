import { startTaskTimer, stopTaskTimer, getTaskTimeLogs } from "@/services/api/taskService";
import { getAllTasks } from "@/services/api/taskService";

export const getAllTimeTrackingEntries = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "task_id" } },
        { field: { Name: "start_time" } },
        { field: { Name: "end_time" } },
        { field: { Name: "duration" } },
        { field: { Name: "date" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } }
      ]
    };

    const response = await apperClient.fetchRecords("time_tracking_entry", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching time tracking entries:", error);
    throw error;
  }
};

export const createTimeTrackingEntry = async (entryData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: entryData.name || entryData.Name || `Time Entry ${Date.now()}`,
        task_id: parseInt(entryData.taskId || entryData.task_id),
        start_time: entryData.startTime || entryData.start_time,
        end_time: entryData.endTime || entryData.end_time,
        duration: entryData.duration || 0,
        date: entryData.date,
        Tags: entryData.Tags || "",
        Owner: entryData.Owner
      }]
    };

    const response = await apperClient.createRecord("time_tracking_entry", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} time entries:${JSON.stringify(failedRecords)}`);
        throw new Error("Some time entries failed to create");
      }
      
      return successfulRecords[0]?.data;
    }
  } catch (error) {
    console.error("Error creating time tracking entry:", error);
    throw error;
  }
};

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
    const projectTasks = tasks.filter(t => t.projectId === String(projectId) || t.project_id === String(projectId));
    
    let totalTime = 0;
    let activeTimers = 0;
    let totalEntries = 0;
    const timeLogs = [];

    projectTasks.forEach(task => {
      if (task.timeTracking || task.time_tracking) {
        const tracking = task.timeTracking || task.time_tracking;
        if (typeof tracking === 'string') {
          // If it's a string, try to parse it or use default values
          totalTime += 0;
        } else {
          totalTime += tracking.totalTime || 0;
          
          if (tracking.activeTimer) {
            activeTimers++;
          }
          
          if (tracking.timeLogs) {
            totalEntries += tracking.timeLogs.length;
            timeLogs.push(...tracking.timeLogs.map(log => ({
              ...log,
              taskId: task.Id,
              taskTitle: task.title || task.Name
            })));
          }
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
      if (task.timeTracking || task.time_tracking) {
        const tracking = task.timeTracking || task.time_tracking;
        if (typeof tracking === 'string') {
          // If it's a string, skip processing
          return;
        }
        
        summary.totalTime += tracking.totalTime || 0;
        
        if (tracking.activeTimer) {
          summary.activeTimers++;
        }
        
        if (tracking.timeLogs) {
          summary.totalEntries += tracking.timeLogs.length;
        }

        if ((tracking.totalTime && tracking.totalTime > 0) || tracking.activeTimer) {
          summary.taskBreakdown.push({
            taskId: task.Id,
            taskTitle: task.title || task.Name,
            projectId: task.projectId || task.project_id,
            totalTime: tracking.totalTime || 0,
            hasActiveTimer: !!tracking.activeTimer,
            entryCount: tracking.timeLogs?.length || 0
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