import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative w-10 h-10 p-0 rounded-full"
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === "dark" ? 180 : 0,
          scale: theme === "dark" ? 0.8 : 1 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <ApperIcon 
          name={theme === "dark" ? "Moon" : "Sun"} 
          size={18} 
          className="text-gray-600 dark:text-gray-300"
        />
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;