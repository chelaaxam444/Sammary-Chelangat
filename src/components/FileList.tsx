import React, { useState } from 'react';
import { BundleFile, TransferStatus } from '../types';
import {
  Database,
  FileCode,
  FileArchive,
  FileText,
  FileCheck,
  Search,
  CheckSquare,
  Square,
  Eye,
  Download,
  Copy,
  FolderOpen
} from 'lucide-react';

interface FileListProps {
  files: BundleFile[];
  selectedFileIds: Set<string>;
  onToggleSelectFile: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onPreviewFile: (file: BundleFile) => void;
  transferStatus: TransferStatus;
  currentTransferFileId?: string;
  onStartCopy: () => void;
  onCancelCopy: () => void;
  onDirectDownload: (file?: BundleFile) => void;
  destinationPath: string;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedFileIds,
  onToggleSelectFile,
  onSelectAll,
  onDeselectAll,
  onPreviewFile,
  transferStatus,
  currentTransferFileId,
  onStartCopy,
  onCancelCopy,
  onDirectDownload,
  destinationPath,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allSelected = filteredFiles.length > 0 && filteredFiles.every((f) => selectedFileIds.has(f.id));
  const isTransferring = transferStatus === 'transferring';

  const getFileIcon = (type: BundleFile['type']) => {
    switch (type) {
      case 'database':
        return <Database className="w-4 h-4 text-indigo-600 shrink-0" />;
      case 'index':
        return <FileCode className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'json':
        return <FileText className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'xml':
        return <FileCode className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'archive':
        return <FileArchive className="w-4 h-4 text-purple-600 shrink-0" />;
      case 'checksum':
        return <FileCheck className="w-4 h-4 text-teal-600 shrink-0" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  const selectedCount = selectedFileIds.size;
  const totalSelectedBytes = files
    .filter((f) => selectedFileIds.has(f.id))
    .reduce((acc, f) => acc + f.sizeBytes, 0);
  
  const formatTotalSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <section className="flex-1 bg-white flex flex-col overflow-hidden min-w-0">
      {/* Top action header matching design */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
          <span className="shrink-0 font-medium">Remote Server: TR</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold font-mono truncate">
            cecily_bundle_v4
          </span>
          <span className="hidden xl:inline text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">
            {files.length} items
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Action buttons */}
          {isTransferring ? (
            <button
              id="cancel-copy-btn"
              onClick={onCancelCopy}
              className="px-4 py-2 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded text-sm font-semibold transition-colors shadow-xs"
            >
              Cancel Transfer
            </button>
          ) : (
            <>
              <button
                id="copy-to-desktop-btn"
                onClick={onStartCopy}
                disabled={selectedCount === 0}
                className={`px-4 py-2 rounded text-sm font-semibold shadow-xs flex items-center gap-2 transition-all ${
                  selectedCount > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Copy className="w-4 h-4" />
                <span>Copy to Desktop</span>
                {selectedCount > 0 && (
                  <span className="bg-blue-500 text-white text-[11px] px-1.5 py-0.2 rounded font-normal">
                    {selectedCount}
                  </span>
                )}
              </button>

              <button
                id="direct-download-btn"
                onClick={() => onDirectDownload()}
                title="Download real bundle archive directly to your browser/desktop"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Save to Disk</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search and filter toolbar */}
      <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            id="file-search-input"
            type="text"
            placeholder="Filter files in cecily_bundle_v4..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <span>
            Selected:{' '}
            <strong className="text-slate-800 font-mono">
              {selectedCount} / {files.length}
            </strong>{' '}
            ({formatTotalSize(totalSelectedBytes)})
          </span>
          <button
            id="toggle-select-all-btn"
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {/* Files Table */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] text-slate-400 border-b border-slate-100 uppercase font-bold tracking-wider">
              <th className="pb-3 px-2 w-8">
                <button
                  onClick={allSelected ? onDeselectAll : onSelectAll}
                  className="text-slate-400 hover:text-slate-600"
                  title="Toggle all files"
                >
                  {allSelected ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="pb-3 px-2">File Name</th>
              <th className="pb-3 px-2 text-right">Size</th>
              <th className="pb-3 px-2 hidden md:table-cell">Modified</th>
              <th className="pb-3 px-2 text-center">Status</th>
              <th className="pb-3 px-2 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
            {filteredFiles.map((file) => {
              const isSelected = selectedFileIds.has(file.id);
              const isCurrentlyTransferring =
                isTransferring && currentTransferFileId === file.id;

              return (
                <tr
                  key={file.id}
                  id={`file-row-${file.id}`}
                  className={`transition-colors group hover:bg-slate-50/70 ${
                    isSelected ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="py-3.5 px-2">
                    <button
                      onClick={() => onToggleSelectFile(file.id)}
                      className="text-slate-400 hover:text-blue-600"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  </td>

                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded bg-slate-100 group-hover:bg-white transition-colors">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 truncate flex items-center gap-2">
                          <span className="font-mono">{file.name}</span>
                          {file.name.includes('main.db') && (
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded uppercase tracking-wider font-semibold">
                              Primary Core
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-xs md:max-w-md">
                          {file.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-2 text-right font-mono text-slate-700 font-medium">
                    {file.sizeFormatted}
                  </td>

                  <td className="py-3.5 px-2 hidden md:table-cell text-slate-500 text-xs">
                    {file.modified}
                  </td>

                  <td className="py-3.5 px-2 text-center">
                    {isCurrentlyTransferring ? (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Copying
                      </span>
                    ) : transferStatus === 'completed' && isSelected ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Copied
                      </span>
                    ) : isSelected ? (
                      <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Selected
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-normal">
                        Ready
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        id={`inspect-btn-${file.id}`}
                        onClick={() => onPreviewFile(file)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                        title={`Inspect ${file.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        id={`download-single-btn-${file.id}`}
                        onClick={() => onDirectDownload(file)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title={`Download ${file.name} directly`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredFiles.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">
            No files found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Context banner for Destination */}
      <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2 truncate">
          <FolderOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Local Destination Target:</span>
          <span className="font-mono text-slate-800 font-medium truncate">
            {destinationPath}
          </span>
        </div>
        <div className="hidden sm:block text-slate-400">
          Press "Copy to Desktop" to initiate high-speed transfer
        </div>
      </div>
    </section>
  );
};
