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
  
  const newInvoice = {
    ...invoiceData,
    Id: Math.max(...invoices.map(i => i.Id)) + 1
  };
  
  invoices.push(newInvoice);
  return { ...newInvoice };
};

export const updateInvoice = async (id, invoiceData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const index = invoices.findIndex(i => i.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Invoice not found");
  }
  
  invoices[index] = { ...invoices[index], ...invoiceData };
  return { ...invoices[index] };
};

export const deleteInvoice = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = invoices.findIndex(i => i.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Invoice not found");
  }
  
  invoices.splice(index, 1);
  return true;
};