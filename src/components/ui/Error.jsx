import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md mx-auto text-center p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <ApperIcon name="AlertTriangle" size={32} className="text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Oops! Something went wrong
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400">
              {message}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              {onRetry && (
                <Button onClick={onRetry} variant="primary">
                  <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                  Try Again
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                Refresh Page
              </Button>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Error;