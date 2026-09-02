import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Zap, Loader2 } from 'lucide-react';

interface ActionPreviewProps {
  preview: any;
  onExecute: () => void;
  onCancel: () => void;
}

export const ActionPreview: React.FC<ActionPreviewProps> = ({ preview, onExecute, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/80 border border-brand-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-500" />
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-brand-400" />
            <h4 className="text-sm font-semibold text-slate-200">Action Preview</h4>
          </div>
          <p className="text-xs text-slate-400">Please confirm before execution.</p>
        </div>
        <div className="text-xs font-mono px-2 py-1 bg-brand-500/10 text-brand-300 rounded">
          {preview.action}
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-4 mb-4 font-mono text-sm text-slate-300 border border-slate-700/50">
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(preview.preview || preview, null, 2)}
        </pre>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={onExecute}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
        >
          <Check className="w-4 h-4" />
          Execute Action
        </button>
      </div>
    </motion.div>
  );
};
