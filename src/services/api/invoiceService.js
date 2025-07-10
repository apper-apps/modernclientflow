import invoicesData from "@/services/mockData/invoices.json";

let invoices = [...invoicesData];

export const getAllInvoices = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 250));
  return [...invoices];
};

export const getInvoiceById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  const invoice = invoices.find(i => i.Id === parseInt(id));
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  return { ...invoice };
};

export const createInvoice = async (invoiceData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Validate required fields
  if (!invoiceData.projectId) {
    throw new Error("Project ID is required");
  }
  if (!invoiceData.amount || invoiceData.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }
  if (!invoiceData.dueDate) {
    throw new Error("Due date is required");
  }
  
  // Generate next sequential ID
  const nextId = invoices.length > 0 ? Math.max(...invoices.map(i => i.Id)) + 1 : 1;
  
  const newInvoice = {
    ...invoiceData,
    Id: nextId,
    projectId: parseInt(invoiceData.projectId),
    clientId: invoiceData.clientId || '',
    amount: parseFloat(invoiceData.amount),
    status: invoiceData.status || 'draft',
    dueDate: invoiceData.dueDate,
    lineItems: invoiceData.lineItems || []
  };
  
  invoices.push(newInvoice);
  return { ...newInvoice };
};

export const updateInvoice = async (id, invoiceData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid invoice ID");
  }
  
  const index = invoices.findIndex(i => i.Id === parsedId);
  if (index === -1) {
    throw new Error("Invoice not found");
  }
  
  // Validate data if provided
  if (invoiceData.amount !== undefined && invoiceData.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }
  
  // Update invoice while preserving ID
  invoices[index] = { 
    ...invoices[index], 
    ...invoiceData,
    Id: parsedId,
    projectId: invoiceData.projectId ? parseInt(invoiceData.projectId) : invoices[index].projectId,
    amount: invoiceData.amount !== undefined ? parseFloat(invoiceData.amount) : invoices[index].amount
  };
  
  return { ...invoices[index] };
};

export const deleteInvoice = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid invoice ID");
  }
  
  const index = invoices.findIndex(i => i.Id === parsedId);
  if (index === -1) {
    throw new Error("Invoice not found");
  }
  
  invoices.splice(index, 1);
  return true;
};