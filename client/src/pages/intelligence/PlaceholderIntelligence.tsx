import React from 'react';
import { motion } from 'framer-motion';

export const PlaceholderIntelligence: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="p-8 h-full flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-glass-medium backdrop-blur-glass-md border border-glass-border rounded-2xl p-8 shadow-glass-lg"
      >
        <div className="w-16 h-16 mx-auto bg-brand-500/20 rounded-full flex items-center justify-center mb-6 border border-brand-500/30">
          <span className="text-2xl">🚧</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400">
          This feature is currently under development as part of the SYNORA AI Phase 1 implementation plan.
        </p>
      </motion.div>
    </div>
  );
};
