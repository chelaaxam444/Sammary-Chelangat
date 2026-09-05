import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FileList } from './components/FileList';
import { TransferBar } from './components/TransferBar';
import { Footer } from './components/Footer';
import { FilePreviewModal } from './components/FilePreviewModal';
import { LogsModal } from './components/LogsModal';
import { INITIAL_FILES, NODES, DESTINATIONS } from './data/mockData';
import { BundleFile, TransferState, TransferLog } from './types';

export default function App() {
  const [files] = useState<BundleFile[]>(INITIAL_FILES);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(
    new Set(['f-1', 'f-2', 'f-3', 'f-4']) // TR_cecily_main.db, index, meta, config selected as in design
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-tr');
  const [selectedDestId, setSelectedDestId] = useState<string>('dest-desktop');

  // Preview & Logs Modals
  const [previewFile, setPreviewFile] = useState<BundleFile | null>(null);
  const [showLogs, setShowLogs] = useState<boolean>(false);

  // Success Notification banner
  const [notification, setNotification] = useState<string | null>(null);

  // Transfer State
  const [transferState, setTransferState] = useState<TransferState>({
    status: 'idle',
    currentFileIndex: 0,
    progressPercent: 28, // initial 28% to match design's w-[28%]!
    transferredBytes: 426919200, // 0.4 GB
    totalBytes: 1524711424, // 1.42 GB
    transferSpeedMBs: 48.2,
    timeRemainingSec: 42, // matching design's 42s!
  });

  const [logs, setLogs] = useState<TransferLog[]>([
    {
      id: 'log-1',
      timestamp: '10:20:14',
      level: 'info',
      message: 'Initialized SFTP tunnel to tr-gateway.internal:2222',
    },
    {
      id: 'log-2',
      timestamp: '10:20:15',
      level: 'info',
      message: 'AES-256-GCM cipher negotiated. Local destination: ~/Desktop/TR_cecily/',
    },
    {
      id: 'log-3',
      timestamp: '10:20:18',
      level: 'info',
      message: 'Verified remote node manifest: cecily_bundle_v4 (6 objects, 1.82 GB total)',
    },
    {
      id: 'log-4',
      timestamp: '10:20:20',
      level: 'info',
      message: 'Started stream for TR_cecily_main.db (Buffer: 64MB chunks)',
    },
  ]);

  const selectedNode = NODES.find((n) => n.id === selectedNodeId) || NODES[0];
  const selectedDest =
    DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];

  const selectedFilesList = files.filter((f) => selectedFileIds.has(f.id));
  const currentActiveFile =
    selectedFilesList[transferState.currentFileIndex] || selectedFilesList[0] || files[0];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (message: string, level: TransferLog['level'] = 'info') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        level,
        message,
      },
    ]);
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedFileIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedFileIds(new Set(files.map((f) => f.id)));
  };

  const handleDeselectAll = () => {
    setSelectedFileIds(new Set());
  };

  // Start copy transfer simulation
  const handleStartCopy = () => {
    if (selectedFileIds.size === 0) return;

    const totalBytes = files
      .filter((f) => selectedFileIds.has(f.id))
      .reduce((acc, f) => acc + f.sizeBytes, 0);

    setTransferState({
      status: 'transferring',
      currentFileIndex: 0,
      progressPercent: 0,
      transferredBytes: 0,
      totalBytes,
      transferSpeedMBs: 48.5 + (Math.random() * 5 - 2.5),
      timeRemainingSec: Math.ceil(totalBytes / (48.5 * 1024 * 1024)),
    });

    addLog(
      `Initiated desktop copy of ${selectedFileIds.size} files to ${selectedDest.path}`,
      'info'
    );
  };

  const handlePauseResume = () => {
    setTransferState((prev) => {
      if (prev.status === 'transferring') {
        addLog('Transfer paused by user', 'warn');
        return { ...prev, status: 'paused' };
      } else if (prev.status === 'paused') {
        addLog('Transfer resumed', 'info');
        return { ...prev, status: 'transferring' };
      }
      return prev;
    });
  };

  const handleCancelCopy = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTransferState((prev) => ({
      ...prev,
      status: 'cancelled',
      progressPercent: 0,
      transferredBytes: 0,
      timeRemainingSec: 0,
    }));
    addLog('Transfer cancelled by operator', 'error');
  };

  // Transfer simulation ticker
  useEffect(() => {
    if (transferState.status === 'transferring') {
      timerRef.current = setInterval(() => {
        setTransferState((prev) => {
          if (prev.status !== 'transferring') return prev;

          // Increment bytes by roughly ~45-55MB per interval tick (150ms => ~7MB)
          const chunkSize = 7 * 1024 * 1024 + Math.floor(Math.random() * 2 * 1024 * 1024);
          const nextTransferred = Math.min(prev.totalBytes, prev.transferredBytes + chunkSize);
          const nextPercent = (nextTransferred / (prev.totalBytes || 1)) * 100;
          const remainingBytes = prev.totalBytes - nextTransferred;
          const currentSpeedMBs = 48.2 + (Math.random() * 4 - 2);
          const nextRemainingSec = Math.max(
            0,
            Math.ceil(remainingBytes / (currentSpeedMBs * 1024 * 1024))
          );

          if (nextTransferred >= prev.totalBytes) {
            clearInterval(timerRef.current!);
            addLog(`All files transferred successfully to ${selectedDest.path}`, 'success');
            addLog(`Verifying SHA-256 signatures for cecily_bundle_v4...`, 'info');
            setTimeout(() => {
              addLog(`Integrity validation: PASS (Zero mismatches)`, 'success');
              setNotification(`Successfully copied TR Cecily bundle to ${selectedDest.name}!`);
              setTimeout(() => setNotification(null), 5000);
            }, 800);

            return {
              ...prev,
              status: 'completed',
              progressPercent: 100,
              transferredBytes: prev.totalBytes,
              timeRemainingSec: 0,
            };
          }

          return {
            ...prev,
            transferredBytes: nextTransferred,
            progressPercent: nextPercent,
            transferSpeedMBs: currentSpeedMBs,
            timeRemainingSec: nextRemainingSec,
          };
        });
      }, 250);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [transferState.status, selectedDest.path, selectedDest.name]);

  // Actual Browser Download helper (allows user to get real files on their computer)
  const handleDownloadFile = (fileToDownload?: BundleFile) => {
    if (fileToDownload) {
      const content =
        fileToDownload.previewContent ||
        `TR Cecily File Export\nName: ${fileToDownload.name}\nSize: ${fileToDownload.sizeFormatted}\nChecksum: ${fileToDownload.checksum}\nDate: ${fileToDownload.modified}\n`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileToDownload.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addLog(`Downloaded file: ${fileToDownload.name}`, 'success');
      setNotification(`Downloaded ${fileToDownload.name} to your local device`);
      setTimeout(() => setNotification(null), 4000);
    } else {
      // Download bundle manifest
      const manifest = {
        title: 'TR Cecily Data Bundle Package',
        bundle_id: 'cecily_bundle_v4',
        origin: 'Remote Server: TR (sftp.tr-gateway.internal)',
        destination: selectedDest.name,
        timestamp: new Date().toISOString(),
        files: files.map((f) => ({
          name: f.name,
          size: f.sizeFormatted,
          checksum: f.checksum,
          type: f.type,
        })),
        integrity_status: 'VERIFIED',
      };
      const blob = new Blob([JSON.stringify(manifest, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TR_cecily_bundle_manifest.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addLog(`Exported TR Cecily bundle package manifest to disk`, 'success');
      setNotification(`Saved TR Cecily manifest to your local computer`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div
      id="app-root"
      className="w-full h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900 overflow-hidden"
    >
      {/* Top Navbar */}
      <Navbar onOpenLogs={() => setShowLogs(true)} logsCount={logs.length} />

      {/* Optional Success Notification Toast */}
      {notification && (
        <div
          id="notification-toast"
          className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Area with Sidebar & FileList */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        <Sidebar
          nodes={NODES}
          selectedNodeId={selectedNodeId}
          onSelectNode={(id) => {
            setSelectedNodeId(id);
            addLog(`Switched connected node to ${id}`, 'info');
          }}
          destinations={DESTINATIONS}
          selectedDestId={selectedDestId}
          onSelectDestination={(id) => {
            setSelectedDestId(id);
            const dest = DESTINATIONS.find((d) => d.id === id);
            if (dest) addLog(`Target destination set to ${dest.path}`, 'info');
          }}
        />

        <FileList
          files={files}
          selectedFileIds={selectedFileIds}
          onToggleSelectFile={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onPreviewFile={(file) => setPreviewFile(file)}
          transferStatus={transferState.status}
          currentTransferFileId={currentActiveFile?.id}
          onStartCopy={handleStartCopy}
          onCancelCopy={handleCancelCopy}
          onDirectDownload={handleDownloadFile}
          destinationPath={selectedDest.path}
        />
      </main>

      {/* Bottom Transfer Status Bar matching design layout & style */}
      <TransferBar
        transferState={transferState}
        activeFile={currentActiveFile}
        selectedCount={selectedFileIds.size}
        destinationName={selectedDest.name}
        onPauseResume={handlePauseResume}
        onCancel={handleCancelCopy}
        onStartCopy={handleStartCopy}
        onDirectDownload={() => handleDownloadFile()}
      />

      {/* Bottom Status Footer */}
      <Footer
        serverHost="tr-gateway.internal:2222"
        targetFolder={selectedDest.path}
      />

      {/* File Inspection Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={(f) => {
            handleDownloadFile(f);
            setPreviewFile(null);
          }}
        />
      )}

      {/* Console Logs Modal */}
      {showLogs && (
        <LogsModal
          logs={logs}
          onClose={() => setShowLogs(false)}
          onClear={() => setLogs([])}
        />
      )}
    </div>
  );
}
