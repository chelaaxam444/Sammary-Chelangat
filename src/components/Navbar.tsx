import React from 'react';
import { HardDriveDownload, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenLogs: () => void;
  logsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogs, logsCount }) => {
  return (
    <nav
      id="app-navbar"
      className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm z-10"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          id="logo-icon"
          className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs"
        >
          <div className="w-4 h-1 bg-white rounded-full"></div>
        </div>
        <div className="flex items-baseline gap-2">
          <h1 className="font-semibold text-lg tracking-tight text-slate-900">
            DataBridge Pro
          </h1>
          <span className="hidden md:inline text-xs font-medium text-slate-400">
            v1.4.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          id="view-logs-btn"
          onClick={onOpenLogs}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          title="View Transfer Logs"
        >
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>Console Logs</span>
          {logsCount > 0 && (
            <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {logsCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-md text-xs font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System: Active</span>
        </div>

        <div className="px-3 py-1.5 bg-blue-50 rounded-md text-xs font-medium text-blue-700 border border-blue-100 uppercase tracking-wider font-mono">
          Task ID: 8842-X
        </div>
      </div>
    </nav>
  );
};
