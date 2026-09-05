export interface BundleFile {
  id: string;
  name: string;
  sizeBytes: number;
  sizeFormatted: string;
  modified: string;
  type: 'database' | 'index' | 'json' | 'xml' | 'archive' | 'checksum';
  checksum: string;
  description: string;
  previewContent?: string;
}

export type TransferStatus = 'idle' | 'transferring' | 'paused' | 'completed' | 'cancelled';

export interface TransferState {
  status: TransferStatus;
  currentFileIndex: number;
  progressPercent: number;
  transferredBytes: number;
  totalBytes: number;
  transferSpeedMBs: number;
  timeRemainingSec: number;
}

export interface NodeItem {
  id: string;
  name: string;
  type: 'remote' | 'cloud' | 'archive';
  status: 'active' | 'ready' | 'offline';
  path: string;
  protocol: string;
}

export interface DestinationItem {
  id: string;
  name: string;
  path: string;
  availableSpace: string;
  isDefault?: boolean;
}

export interface TransferLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}
