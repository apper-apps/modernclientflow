import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData];

export const getAllProjects = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 250));
  return [...projects];
};

export const getProjectById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  const project = projects.find(p => p.Id === parseInt(id));
  if (!project) {
    throw new Error("Project not found");
  }
  return { ...project };
};

export const createProject = async (projectData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newProject = {
    ...projectData,
    Id: Math.max(...projects.map(p => p.Id)) + 1
  };
  
  projects.push(newProject);
  return { ...newProject };
};

export const updateProject = async (id, projectData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const index = projects.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Project not found");
  }
  
  projects[index] = { ...projects[index], ...projectData };
  return { ...projects[index] };
};

export const deleteProject = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = projects.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Project not found");
  }
  
  projects.splice(index, 1);
  return true;
};