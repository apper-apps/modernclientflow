import dashboardData from "@/services/mockData/dashboard.json";

export const getDashboardData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    summary: dashboardData.summary,
    recentActivity: dashboardData.recentActivity,
    quickStats: dashboardData.quickStats
  };
};