import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const NavigationItem = ({ to, icon, label, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
          isActive
            ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <ApperIcon 
              name={icon} 
              size={20} 
              className={`transition-colors duration-200 ${
                isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-primary-600"
              }`}
            />
          </motion.div>
          <span className="flex-1">{label}</span>
          {badge && (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              isActive 
                ? "bg-white/20 text-white" 
                : "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300"
            }`}>
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavigationItem;