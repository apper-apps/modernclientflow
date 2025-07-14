export const getAllTasks = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "time_tracking" } },
        { field: { Name: "project_id" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } }
      ]
    };

    const response = await apperClient.fetchRecords("task", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getTaskById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "time_tracking" } },
        { field: { Name: "project_id" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } }
      ]
    };

    const response = await apperClient.getRecordById("task", parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: taskData.name || taskData.Name || taskData.title,
        title: taskData.title || taskData.name || taskData.Name,
        priority: taskData.priority || "medium",
        status: taskData.status || "todo",
        due_date: taskData.dueDate || taskData.due_date,
        time_tracking: taskData.timeTracking || taskData.time_tracking || "",
        project_id: parseInt(taskData.projectId || taskData.project_id),
        Tags: taskData.Tags || "",
        Owner: taskData.Owner
      }]
    };

    const response = await apperClient.createRecord("task", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
        throw new Error("Some tasks failed to create");
      }
      
      return successfulRecords[0]?.data;
    }
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        Name: taskData.name || taskData.Name || taskData.title,
        title: taskData.title || taskData.name || taskData.Name,
        priority: taskData.priority,
        status: taskData.status,
        due_date: taskData.dueDate || taskData.due_date,
        time_tracking: taskData.timeTracking || taskData.time_tracking,
        project_id: parseInt(taskData.projectId || taskData.project_id),
        Tags: taskData.Tags,
        Owner: taskData.Owner
      }]
    };

    const response = await apperClient.updateRecord("task", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
        throw new Error("Task update failed");
      }
      
      return successfulUpdates[0]?.data;
    }
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        status: status
      }]
    };

    const response = await apperClient.updateRecord("task", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} task status:${JSON.stringify(failedUpdates)}`);
        throw new Error("Task status update failed");
      }
      
      return successfulUpdates[0]?.data;
    }
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord("task", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Time tracking methods preserved for backward compatibility
export const startTaskTimer = async (id) => {
  // For now, return mock timer data until time tracking entries are integrated
  return {
    Id: parseInt(id),
    startTime: new Date().toISOString()
  };
};

export const stopTaskTimer = async (id) => {
  // For now, return mock time log data until time tracking entries are integrated
  const now = new Date().toISOString();
  return {
    Id: Date.now(),
    startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    endTime: now,
    duration: 3600000,
    date: now.split('T')[0]
  };
};

export const getTaskTimeLogs = async (id) => {
  // For now, return empty array until time tracking entries are integrated
  return [];
};