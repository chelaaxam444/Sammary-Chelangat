import React from 'react';
import { TransferLog } from '../types';
import { X, Terminal, Trash2, CheckCircle2 } from 'lucide-react';

interface LogsModalProps {
  logs: TransferLog[];
  onClose: () => void;
  onClear: () => void;
}

export const LogsModal: React.FC<LogsModalProps> = ({ logs, onClose, onClear }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        id="logs-modal-dialog"
        className="w-full max-w-2xl bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-700 flex flex-col max-h-[80vh] overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs text-slate-300">
              DataBridge Tunnel Diagnostics Log
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              title="Clear Logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto font-mono text-xs space-y-1.5 flex-1 bg-slate-900 select-text">
          {logs.map((log) => {
            let color = 'text-slate-300';
            if (log.level === 'success') color = 'text-emerald-400';
            if (log.level === 'warn') color = 'text-amber-400';
            if (log.level === 'error') color = 'text-rose-400';

            return (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-slate-500 shrink-0 select-none">
                  [{log.timestamp}]
                </span>
                <span className={`${color} break-all`}>{log.message}</span>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-2.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Target: ~/Desktop/TR_cecily/</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            AES-256 Validated
          </span>
        </div>
      </div>
    </div>
  );
};
