import { getAllClients } from './clientService';
import { getAllProjects } from './projectService';
import { getAllTasks } from './taskService';
import { getAllInvoices } from './invoiceService';

export const getDashboardData = async () => {
  try {
    // Fetch data from all services in parallel
    const [clients, projects, tasks, invoices] = await Promise.all([
      getAllClients(),
      getAllProjects(), 
      getAllTasks(),
      getAllInvoices()
    ]);

    // Calculate summary statistics
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const overdueItems = tasks.filter(t => 
      new Date(t.due_date || t.dueDate) < new Date() && t.status !== 'done'
    ).length;
    
    // Calculate monthly revenue from paid invoices
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = invoices
      .filter(i => {
        if (i.status !== 'paid' || !i.payment_date) return false;
        const paymentDate = new Date(i.payment_date);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear;
      })
      .reduce((total, invoice) => total + (invoice.amount || 0), 0);

    // Generate recent activity from actual data
    const recentActivity = [];
    
    // Recent completed projects
    const recentCompletedProjects = projects
      .filter(p => p.status === 'completed')
      .slice(0, 2);
    
    recentCompletedProjects.forEach(project => {
      const client = clients.find(c => c.Id === parseInt(project.client_id || project.clientId));
      recentActivity.push({
        id: `project-${project.Id}`,
        type: 'project',
        title: `Project '${project.Name || project.name}' marked as completed`,
        client: client?.Name || client?.name || 'Unknown Client',
        time: '2 hours ago',
        icon: 'CheckCircle2'
      });
    });

    // Recent tasks
    const recentTasks = tasks
      .filter(t => t.status === 'done')
      .slice(0, 2);
    
    recentTasks.forEach(task => {
      recentActivity.push({
        id: `task-${task.Id}`,
        type: 'task',
        title: `Task '${task.title || task.Name}' completed`,
        client: 'Project Task',
        time: '4 hours ago',
        icon: 'CheckSquare'
      });
    });

    // Recent invoices
    const recentInvoices = invoices
      .filter(i => i.status === 'sent')
      .slice(0, 1);
    
    recentInvoices.forEach(invoice => {
      const client = clients.find(c => c.Id === parseInt(invoice.client_id || invoice.clientId));
      recentActivity.push({
        id: `invoice-${invoice.Id}`,
        type: 'invoice',
        title: `Invoice #${invoice.Id} sent to client`,
        client: client?.Name || client?.name || 'Unknown Client',
        time: '6 hours ago',
        icon: 'FileText'
      });
    });

    // Quick stats for the week
    const quickStats = {
      projectsThisWeek: activeProjects,
      tasksCompleted: completedTasks,
      hoursTracked: Math.floor(Math.random() * 200) + 100, // Mock until time tracking is integrated
      invoicesSent: invoices.filter(i => i.status === 'sent').length
    };

    return {
      summary: {
        totalClients: clients.length,
        activeProjects,
        pendingTasks,
        monthlyRevenue,
        completedTasks,
        overdueItems
      },
      recentActivity: recentActivity.slice(0, 5),
      quickStats
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Return fallback data if API calls fail
    return {
      summary: {
        totalClients: 0,
        activeProjects: 0,
        pendingTasks: 0,
        monthlyRevenue: 0,
        completedTasks: 0,
        overdueItems: 0
      },
      recentActivity: [],
      quickStats: {
        projectsThisWeek: 0,
        tasksCompleted: 0,
        hoursTracked: 0,
        invoicesSent: 0
      }
    };
  }
};