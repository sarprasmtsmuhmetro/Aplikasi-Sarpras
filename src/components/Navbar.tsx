import React, { useRef } from 'react';
import { 
  Building2, 
  Plus, 
  FileSpreadsheet, 
  Upload, 
  Clock, 
  ShieldCheck, 
  Handshake,
  Link2
} from 'lucide-react';

interface NavbarProps {
  onOpenAddItem: () => void;
  onOpenNewLoan: () => void;
  onExportExcel: () => void;
  onImportExcel: (file: File) => void;
  onOpenShareModal: () => void;
  itemsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddItem,
  onOpenNewLoan,
  onExportExcel,
  onImportExcel,
  onOpenShareModal,
  itemsCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportExcel(file);
      e.target.value = '';
    }
  };

  const currentDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-30 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-4">
          
          {/* Brand & School Logo */}
          <div className="flex items-center space-x-3.5">
            <div className="bg-gradient-to-tr from-cyan-600 via-indigo-600 to-sky-500 p-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 text-white shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-white font-heading">
                  SARPRAS <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">MADTSAMU</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  v2.5 Online
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium truncate max-w-[280px] sm:max-w-md">
                MTs Muhammadiyah Metro &bull; Center of Excellence School
              </p>
            </div>
          </div>

          {/* Right Status & Action Controls */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
            
            {/* Live Online & Date Indicator */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Online Cloud Sync</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentDate}</span>
              </div>
            </div>

            {/* Share Public Form Links button */}
            <button
              onClick={onOpenShareModal}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 transition flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
              title="Bagikan Link Formulir Online Peminjaman & Habis Pakai ke WhatsApp / Guru"
            >
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Link Form Online</span>
            </button>

            {/* Excel Import button */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".xlsx,.xls,.csv" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1.5 shadow-sm"
              title="Import data barang dari file Excel (.xlsx)"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>

            {/* Excel Export button */}
            <button
              onClick={onExportExcel}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition flex items-center gap-1.5 shadow-sm"
              title="Export seluruh data inventaris, peminjaman, & transaksi ke Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* New Loan Button */}
            <button
              onClick={onOpenNewLoan}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/30 transition flex items-center gap-1.5"
            >
              <Handshake className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pinjam</span>
            </button>

            {/* Add Item Button */}
            <button
              onClick={onOpenAddItem}
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-600/25 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Barang</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
