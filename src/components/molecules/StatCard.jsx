import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  icon, 
  gradient = false,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card 
        hover 
        gradient={gradient}
        className="p-6 border-0 shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {value}
              </h3>
              {change && (
                <span className={`text-xs font-medium flex items-center gap-1 ${
                  changeType === "positive" 
                    ? "text-green-600 dark:text-green-400" 
                    : changeType === "negative"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                  {changeType === "positive" && <ApperIcon name="TrendingUp" size={12} />}
                  {changeType === "negative" && <ApperIcon name="TrendingDown" size={12} />}
                  {change}
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name={icon} size={24} className="text-white" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;