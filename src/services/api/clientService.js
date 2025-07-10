import clientsData from "@/services/mockData/clients.json";

let clients = [...clientsData];

export const getAllClients = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...clients];
};

export const getClientById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  const client = clients.find(c => c.Id === parseInt(id));
  if (!client) {
    throw new Error("Client not found");
  }
  return { ...client };
};

export const createClient = async (clientData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newClient = {
    ...clientData,
    Id: Math.max(...clients.map(c => c.Id)) + 1,
    createdAt: new Date().toISOString()
  };
  
  clients.push(newClient);
  return { ...newClient };
};

export const updateClient = async (id, clientData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const index = clients.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Client not found");
  }
  
  clients[index] = { ...clients[index], ...clientData };
  return { ...clients[index] };
};

export const deleteClient = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = clients.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Client not found");
  }
  
  clients.splice(index, 1);
  return true;
};