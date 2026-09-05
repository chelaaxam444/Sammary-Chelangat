import React from 'react';
import { TransferState, BundleFile } from '../types';
import { Play, Pause, XCircle, CheckCircle2, Download, ExternalLink } from 'lucide-react';

interface TransferBarProps {
  transferState: TransferState;
  activeFile?: BundleFile;
  selectedCount: number;
  destinationName: string;
  onPauseResume: () => void;
  onCancel: () => void;
  onStartCopy: () => void;
  onDirectDownload: () => void;
}

export const TransferBar: React.FC<TransferBarProps> = ({
  transferState,
  activeFile,
  selectedCount,
  destinationName,
  onPauseResume,
  onCancel,
  onStartCopy,
  onDirectDownload,
}) => {
  const {
    status,
    progressPercent,
    transferredBytes,
    totalBytes,
    transferSpeedMBs,
    timeRemainingSec,
  } = transferState;

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const isTransferring = status === 'transferring';
  const isPaused = status === 'paused';
  const isCompleted = status === 'completed';

  const fileNameDisplay = activeFile ? activeFile.name : 'TR_cecily_main.db';

  return (
    <div
      id="transfer-status-bar"
      className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-8 shrink-0 select-none"
    >
      {/* Icon Box */}
      <div className="flex items-center gap-4">
        <div
          id="transfer-icon"
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs transition-colors ${
            isCompleted
              ? 'bg-emerald-600'
              : isPaused
              ? 'bg-amber-500'
              : 'bg-blue-600'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M7 16V4h10v12" />
              <path d="M20 20H4l2-2h12l2 2z" />
            </svg>
          )}
        </div>

        {/* Mobile-only status summary */}
        <div className="md:hidden flex-1 min-w-0">
          <div className="text-xs text-slate-500 font-medium truncate">
            {isTransferring
              ? `Copying to ${destinationName}`
              : isCompleted
              ? `Copied to ${destinationName}`
              : isPaused
              ? 'Transfer Paused'
              : `Ready to copy ${selectedCount} files`}
          </div>
          <div className="font-semibold text-slate-800 text-sm truncate font-mono">
            {fileNameDisplay}
          </div>
        </div>
      </div>

      {/* Progress & File Description Center */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-end mb-2">
          <div className="text-sm truncate mr-2">
            <span className="font-bold text-slate-800">
              {isCompleted ? 'Copied:' : isPaused ? 'Paused:' : 'Copying:'}
            </span>{' '}
            <span className="font-mono text-slate-700">{fileNameDisplay}</span>
            {isTransferring && (
              <span className="hidden sm:inline text-xs text-slate-400 font-mono ml-2">
                ({transferSpeedMBs.toFixed(1)} MB/s)
              </span>
            )}
          </div>
          <div className="text-xs font-mono text-slate-500 shrink-0">
            {formatSize(transferredBytes)} / {formatSize(totalBytes || 1524711424)}
          </div>
        </div>

        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            id="transfer-progress-fill"
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? 'bg-emerald-600'
                : isPaused
                ? 'bg-amber-500'
                : 'bg-blue-600'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-400">
          <span>
            {isCompleted
              ? `Verification: SHA-256 Passed (100%)`
              : isPaused
              ? 'Transfer is paused. Click Resume to continue.'
              : status === 'idle'
              ? `Target: ${destinationName} (AES-256 Tunnel)`
              : `Buffer: 64MB chunks • TLS v1.3 stream`}
          </span>
          <span className="font-mono font-medium text-slate-600">
            {progressPercent.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Action Controls & Remaining Time */}
      <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/60">
        {(isTransferring || isPaused) && (
          <div className="flex items-center gap-2">
            <button
              id="pause-resume-btn"
              onClick={onPauseResume}
              className="p-2 border border-slate-300 rounded-lg hover:bg-white text-slate-700 transition-colors shadow-2xs"
              title={isPaused ? 'Resume Transfer' : 'Pause Transfer'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-slate-700" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              id="cancel-transfer-btn"
              onClick={onCancel}
              className="p-2 border border-rose-200 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors shadow-2xs"
              title="Cancel Transfer"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {isCompleted && (
          <button
            id="download-completed-archive-btn"
            onClick={onDirectDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Archive</span>
          </button>
        )}

        {status === 'idle' && (
          <button
            id="start-transfer-idle-btn"
            onClick={onStartCopy}
            disabled={selectedCount === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            Start Transfer
          </button>
        )}

        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">
            {isCompleted ? 'Status' : isPaused ? 'State' : 'Est. Remaining'}
          </div>
          <div className="text-xl font-bold text-slate-800 font-mono">
            {isCompleted ? 'Done' : isPaused ? 'Paused' : `${timeRemainingSec}s`}
          </div>
        </div>
      </div>
    </div>
  );
};
