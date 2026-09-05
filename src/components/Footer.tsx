import React from 'react';

interface FooterProps {
  serverHost?: string;
  targetFolder?: string;
}

export const Footer: React.FC<FooterProps> = ({
  serverHost = 'tr-gateway.internal:2222',
  targetFolder = '~/Desktop/TR_cecily',
}) => {
  return (
    <footer
      id="app-footer"
      className="h-8 bg-slate-900 text-[10px] text-slate-400 flex items-center px-4 sm:px-6 gap-3 sm:gap-4 shrink-0 font-mono select-none"
    >
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span className="text-slate-300">Protocol: SFTP/SSH</span>
      </div>

      <span className="w-px h-3 bg-slate-700"></span>

      <span>Encryption: AES-256</span>

      <span className="hidden md:inline w-px h-3 bg-slate-700"></span>

      <span className="hidden md:inline text-slate-400 truncate max-w-xs">
        Host: {serverHost}
      </span>

      <span className="hidden lg:inline w-px h-3 bg-slate-700"></span>

      <span className="hidden lg:inline text-slate-400 truncate max-w-xs">
        Target: {targetFolder}
      </span>

      <span className="ml-auto text-slate-500">Build 1.4.0-Stable</span>
    </footer>
  );
};
