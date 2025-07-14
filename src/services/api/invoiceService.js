export const getAllInvoices = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "payment_date" } },
        { field: { Name: "line_items" } },
        { field: { Name: "client_id" } },
        { field: { Name: "project_id" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } }
      ]
    };

    const response = await apperClient.fetchRecords("app_invoice", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "payment_date" } },
        { field: { Name: "line_items" } },
        { field: { Name: "client_id" } },
        { field: { Name: "project_id" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } }
      ]
    };

    const response = await apperClient.getRecordById("app_invoice", parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice with ID ${id}:`, error);
    throw error;
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    // Validate required fields
    if (!invoiceData.projectId && !invoiceData.project_id) {
      throw new Error("Project ID is required");
    }
    if (!invoiceData.amount || invoiceData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    if (!invoiceData.dueDate && !invoiceData.due_date) {
      throw new Error("Due date is required");
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: invoiceData.name || invoiceData.Name || `Invoice ${Date.now()}`,
        amount: parseFloat(invoiceData.amount),
        status: invoiceData.status || "draft",
        due_date: invoiceData.dueDate || invoiceData.due_date,
        payment_date: invoiceData.paymentDate || invoiceData.payment_date || "",
        line_items: invoiceData.lineItems || invoiceData.line_items || "",
        client_id: parseInt(invoiceData.clientId || invoiceData.client_id || 0),
        project_id: parseInt(invoiceData.projectId || invoiceData.project_id),
        Tags: invoiceData.Tags || "",
        Owner: invoiceData.Owner
      }]
    };

    const response = await apperClient.createRecord("app_invoice", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} invoices:${JSON.stringify(failedRecords)}`);
        throw new Error("Some invoices failed to create");
      }
      
      return successfulRecords[0]?.data;
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (id, invoiceData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        Name: invoiceData.name || invoiceData.Name,
        amount: parseFloat(invoiceData.amount),
        status: invoiceData.status,
        due_date: invoiceData.dueDate || invoiceData.due_date,
        payment_date: invoiceData.paymentDate || invoiceData.payment_date,
        line_items: invoiceData.lineItems || invoiceData.line_items,
        client_id: parseInt(invoiceData.clientId || invoiceData.client_id),
        project_id: parseInt(invoiceData.projectId || invoiceData.project_id),
        Tags: invoiceData.Tags,
        Owner: invoiceData.Owner
      }]
    };

    const response = await apperClient.updateRecord("app_invoice", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} invoices:${JSON.stringify(failedUpdates)}`);
        throw new Error("Invoice update failed");
      }
      
      return successfulUpdates[0]?.data;
    }
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const markInvoiceAsSent = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        status: "sent"
      }]
    };

    const response = await apperClient.updateRecord("app_invoice", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to mark invoice as sent:${JSON.stringify(failedUpdates)}`);
        throw new Error("Failed to mark invoice as sent");
      }
      
      return successfulUpdates[0]?.data;
    }
  } catch (error) {
    console.error("Error marking invoice as sent:", error);
    throw error;
  }
};

export const markInvoiceAsPaid = async (id, paymentDate) => {
  try {
    if (!paymentDate) {
      throw new Error("Payment date is required");
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        status: "paid",
        payment_date: new Date(paymentDate).toISOString()
      }]
    };

    const response = await apperClient.updateRecord("app_invoice", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to mark invoice as paid:${JSON.stringify(failedUpdates)}`);
        throw new Error("Failed to mark invoice as paid");
      }
      
      return successfulUpdates[0]?.data;
    }
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    throw error;
  }
};

export const deleteInvoice = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord("app_invoice", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return true;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};