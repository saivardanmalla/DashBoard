import React from 'react';
import { Files, Upload, Sparkles } from 'lucide-react';

export const Documents: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Document Management & Vector RAG</h1>
          <p className="text-xs text-slate-400 mt-1">Upload technical specs and documentation for AI semantic search.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium">
          <Upload className="w-3.5 h-3.5" /> Upload File
        </button>
      </div>

      <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3 bg-slate-900/30">
        <Files className="w-10 h-10 text-indigo-400 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-200">Drop PDF, DOCX, or Markdown files here</h3>
        <p className="text-xs text-slate-500">Automatic text chunking, embedding generation, and vector indexing.</p>
      </div>
    </div>
  );
};
