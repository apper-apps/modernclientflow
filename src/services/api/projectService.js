export const getAllProjects = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "status" } },
        { field: { Name: "budget" } },
        { field: { Name: "start_date" } },
        { field: { Name: "end_date" } },
        { field: { Name: "description" } },
        { field: { Name: "client_id" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } }
      ]
    };

    const response = await apperClient.fetchRecords("project", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "status" } },
        { field: { Name: "budget" } },
        { field: { Name: "start_date" } },
        { field: { Name: "end_date" } },
        { field: { Name: "description" } },
        { field: { Name: "client_id" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } }
      ]
    };

    const response = await apperClient.getRecordById("project", parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: projectData.name || projectData.Name,
        status: projectData.status || "planning",
        budget: parseFloat(projectData.budget) || 0,
        start_date: projectData.startDate || projectData.start_date,
        end_date: projectData.endDate || projectData.end_date,
        description: projectData.description || "",
        client_id: parseInt(projectData.clientId || projectData.client_id),
        Tags: projectData.Tags || "",
        Owner: projectData.Owner
      }]
    };

    const response = await apperClient.createRecord("project", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} projects:${JSON.stringify(failedRecords)}`);
        throw new Error("Some projects failed to create");
      }
      
      return successfulRecords[0]?.data;
    }
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        Name: projectData.name || projectData.Name,
        status: projectData.status,
        budget: parseFloat(projectData.budget),
        start_date: projectData.startDate || projectData.start_date,
        end_date: projectData.endDate || projectData.end_date,
        description: projectData.description,
        client_id: parseInt(projectData.clientId || projectData.client_id),
        Tags: projectData.Tags,
        Owner: projectData.Owner
      }]
    };

    const response = await apperClient.updateRecord("project", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} projects:${JSON.stringify(failedUpdates)}`);
        throw new Error("Project update failed");
      }
      
      return successfulUpdates[0]?.data;
    }
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord("project", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};