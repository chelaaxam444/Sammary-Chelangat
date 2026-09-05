import React from 'react';
import { NodeItem, DestinationItem } from '../types';
import { Server, Monitor, Folder, Cloud, HardDrive, Check } from 'lucide-react';

interface SidebarProps {
  nodes: NodeItem[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  destinations: DestinationItem[];
  selectedDestId: string;
  onSelectDestination: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  destinations,
  selectedDestId,
  onSelectDestination,
}) => {
  return (
    <aside
      id="sidebar-nodes-destinations"
      className="w-64 lg:w-72 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-8 shrink-0 select-none overflow-y-auto"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Connected Nodes
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">3 Available</span>
        </div>
        <ul className="space-y-2 text-sm font-medium">
          {nodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <li key={node.id}>
                <button
                  id={`node-btn-${node.id}`}
                  onClick={() => onSelectNode(node.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'bg-white text-blue-600 shadow-xs border border-blue-100 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isSelected ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    />
                    <div className="truncate">
                      <div className="truncate">{node.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {node.protocol}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Local Destinations
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Target Host</span>
        </div>
        <ul className="space-y-2 text-sm font-medium">
          {destinations.map((dest) => {
            const isSelected = dest.id === selectedDestId;
            return (
              <li key={dest.id}>
                <button
                  id={`dest-btn-${dest.id}`}
                  onClick={() => onSelectDestination(dest.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {dest.id === 'dest-desktop' ? (
                        <Monitor className="w-3 h-3" />
                      ) : dest.id === 'dest-downloads' ? (
                        <HardDrive className="w-3 h-3" />
                      ) : (
                        <Folder className="w-3 h-3" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="truncate">{dest.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate font-normal">
                        {dest.path}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      Active
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-200/60">
        <div className="bg-slate-100/70 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600">
          <div className="font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Server className="w-3 h-3 text-slate-500" />
            Host Status
          </div>
          <div className="font-mono text-slate-500 text-[10px]">
            sftp.tr-gateway.internal
          </div>
          <div className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Tunnel latency: 14ms (256-bit AES)
          </div>
        </div>
      </div>
    </aside>
  );
};
