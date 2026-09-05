import React from 'react';
import { BundleFile } from '../types';
import { X, Copy, Download, Check, ShieldCheck, FileText } from 'lucide-react';

interface FilePreviewModalProps {
  file: BundleFile | null;
  onClose: () => void;
  onDownload: (file: BundleFile) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
  onDownload,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!file) return null;

  const handleCopyChecksum = () => {
    navigator.clipboard.writeText(file.checksum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="file-preview-card"
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900 text-base truncate font-mono">
                {file.name}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {file.sizeFormatted} • Modified {file.modified}
              </p>
            </div>
          </div>

          <button
            id="close-preview-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Description
            </div>
            <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {file.description}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SHA-256 Checksum</span>
              </div>
              <button
                onClick={handleCopyChecksum}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="font-mono text-xs bg-slate-100 text-slate-800 p-2.5 rounded-lg border border-slate-200 select-all break-all">
              {file.checksum}
            </div>
          </div>

          {file.previewContent && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Data Stream Inspection
              </div>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto max-h-64 leading-relaxed whitespace-pre-wrap">
                {file.previewContent}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Target: Local Desktop transfer compatible
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              id="download-modal-file-btn"
              onClick={() => onDownload(file)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
