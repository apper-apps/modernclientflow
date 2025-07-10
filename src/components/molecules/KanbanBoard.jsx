import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
  SortableContext as SortableProvider,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import TaskModal from "@/components/molecules/TaskModal";
import { updateTaskStatus, createTask, updateTask, deleteTask } from "@/services/api/taskService";

const KanbanCard = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.Id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityVariant = (priority) => {
    const variants = {
      low: "secondary",
      medium: "warning",
      high: "error"
    };
    return variants[priority] || "default";
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      low: "ArrowDown",
      medium: "ArrowRight",
      high: "ArrowUp"
    };
    return icons[priority] || "Circle";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isDueToday = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return today.toDateString() === due.toDateString();
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && task.status !== "done";
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        draggable={true} 
        isDragging={isDragging}
        className="p-4 mb-3 cursor-grab active:cursor-grabbing"
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
              {task.title}
            </h4>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ApperIcon name="Edit2" size={12} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.Id);
                }}
                className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
              >
                <ApperIcon name="Trash2" size={12} />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge 
                variant={getPriorityVariant(task.priority)} 
                className="text-xs flex items-center gap-1"
              >
                <ApperIcon name={getPriorityIcon(task.priority)} size={10} />
                {task.priority}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <ApperIcon name="Calendar" size={12} />
              <span className={`${
                isOverdue(task.dueDate) ? 'text-red-500' : 
                isDueToday(task.dueDate) ? 'text-orange-500' : ''
              }`}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>

          {(isOverdue(task.dueDate) || isDueToday(task.dueDate)) && (
            <div className="flex items-center gap-1">
              {isOverdue(task.dueDate) && (
                <Badge variant="error" className="text-xs">
                  Overdue
                </Badge>
              )}
              {isDueToday(task.dueDate) && !isOverdue(task.dueDate) && (
                <Badge variant="warning" className="text-xs">
                  Due Today
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const KanbanColumn = ({ column, tasks, onAddTask }) => {
  const taskIds = tasks.map(task => task.Id);

  const getColumnColor = (status) => {
    const colors = {
      todo: "bg-gray-100 dark:bg-gray-800",
      "in-progress": "bg-blue-50 dark:bg-blue-900/20",
      review: "bg-yellow-50 dark:bg-yellow-900/20",
      done: "bg-green-50 dark:bg-green-900/20"
    };
    return colors[status] || "bg-gray-100 dark:bg-gray-800";
  };

  const getColumnIcon = (status) => {
    const icons = {
      todo: "Circle",
      "in-progress": "Clock",
      review: "Eye",
      done: "CheckCircle2"
    };
    return icons[status] || "Circle";
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ApperIcon name={getColumnIcon(column.id)} size={16} className="text-gray-600 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-white text-sm">
              {column.title}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {tasks.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddTask(column.id)}
            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ApperIcon name="Plus" size={14} />
          </Button>
        </div>
      </div>

      <SortableProvider items={taskIds}>
        <div className={`kanban-column p-3 rounded-lg ${getColumnColor(column.id)} min-h-[200px]`}>
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <KanbanCard
                  task={task}
                  onEdit={() => {}} // Will be handled by parent
                  onDelete={() => {}} // Will be handled by parent
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableProvider>
    </div>
  );
};

const KanbanBoard = ({ tasks, onTasksChange, showAddButton = true }) => {
  const [activeId, setActiveId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalDefaultStatus, setModalDefaultStatus] = useState("todo");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = tasks.find(task => task.Id === active.id);
    const overColumn = columns.find(col => 
      getTasksByStatus(col.id).some(task => task.Id === over.id) || 
      col.id === over.id
    );

    if (activeTask && overColumn && activeTask.status !== overColumn.id) {
      try {
        await updateTaskStatus(activeTask.Id, overColumn.id);
        onTasksChange();
        toast.success(`Task moved to ${overColumn.title}`);
      } catch (error) {
        toast.error("Failed to update task status");
      }
    }

    setActiveId(null);
  };

  const handleAddTask = (status = "todo") => {
    setModalDefaultStatus(status);
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        onTasksChange();
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.Id, taskData);
      } else {
        await createTask({ ...taskData, status: modalDefaultStatus });
      }
      onTasksChange();
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {showAddButton && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={() => handleAddTask()}
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Task
          </Button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
              onAddTask={handleAddTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <KanbanCard
              task={tasks.find(task => task.Id === activeId)}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        title={editingTask ? "Edit Task" : "Add Task"}
      />
    </div>
  );
};

export default KanbanBoard;