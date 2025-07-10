import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getAllTasks } from "@/services/api/taskService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const taskData = await getAllTasks();
      setTasks(taskData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityVariant = (priority) => {
    const variants = {
      low: "secondary",
      medium: "warning",
      high: "danger"
    };
    return variants[priority] || "default";
  };

  const getStatusVariant = (status) => {
    const variants = {
      todo: "secondary",
      "in-progress": "primary",
      done: "success"
    };
    return variants[status] || "default";
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      low: "ArrowDown",
      medium: "ArrowRight",
      high: "ArrowUp"
    };
    return icons[priority] || "Circle";
  };

  const getStatusIcon = (status) => {
    const icons = {
      todo: "Circle",
      "in-progress": "Clock",
      done: "CheckCircle2"
    };
    return icons[status] || "Circle";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTasks} />;
  }

  if (tasks.length === 0) {
    return (
      <Empty
        title="No Tasks Yet"
        description="Create your first task to start tracking your work"
        icon="CheckSquare"
        actionLabel="Add Task"
        onAction={() => toast.info("Add task functionality coming soon!")}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="CheckSquare" size={18} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Tasks
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and track your project tasks
          </p>
        </div>
        
        <Button variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Task
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <SearchBar
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        Showing {filteredTasks.length} of {tasks.length} tasks
      </motion.div>

      {/* Tasks List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card hover className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <button className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors duration-200">
                    {task.status === "done" && (
                      <ApperIcon name="Check" size={14} className="text-primary-500" />
                    )}
                  </button>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-gray-900 dark:text-white mb-1 ${
                        task.status === "done" ? "line-through opacity-60" : ""
                      }`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Project ID: {task.projectId}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={getPriorityVariant(task.priority)} 
                        className="flex items-center gap-1"
                      >
                        <ApperIcon name={getPriorityIcon(task.priority)} size={12} />
                        {task.priority}
                      </Badge>
                      
                      <Badge 
                        variant={getStatusVariant(task.status)}
                        className="flex items-center gap-1"
                      >
                        <ApperIcon name={getStatusIcon(task.status)} size={12} />
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" size={14} />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      
                      {new Date(task.dueDate) < new Date() && task.status !== "done" && (
                        <Badge variant="danger" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Edit2" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="MoreHorizontal" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredTasks.length === 0 && (searchTerm || priorityFilter !== "all" || statusFilter !== "all") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Empty
            title="No Tasks Found"
            description={`No tasks match your current filters. Try adjusting your search criteria.`}
            icon="Search"
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchTerm("");
              setPriorityFilter("all");
              setStatusFilter("all");
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Tasks;