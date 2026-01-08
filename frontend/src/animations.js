import React from "react";
import { motion } from "framer-motion";

export const PageTransition = ({ children, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    // exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.8 }}
    style={style}
  >
    {children}
  </motion.div>
);

export const FadeTransition = React.forwardRef(
  ({ children, style, className }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
);
