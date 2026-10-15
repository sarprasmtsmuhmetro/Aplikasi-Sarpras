import React from 'react';
import type { AppState, InventoryItem, LoanRecord } from '../types/inventory.ts';
import { 
  Boxes, 
  Layers, 
  Coins, 
  AlertTriangle, 
  Handshake, 
  Wrench, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  RefreshCw, 
  QrCode, 
  ClipboardCheck, 
  Clock, 
  ChevronRight, 
  ExternalLink,
  Link2,
  PackageOpen,
  Box,
  Check,
  Copy,
  Share2
} from 'lucide-react';
import { 
  calculateTotalQuantity, 
  calculateTotalAssetValue, 
  getLowStockItems, 
  getOverdueLoans, 
  formatCurrencyIDR,
  filterConsumables
} from '../utils/inventoryLogic.ts';

interface DashboardViewProps {
  state: AppState;
  onNavigateTab: (tab: string) => void;
  onQuickInbound: (item?: InventoryItem) => void;
  onQuickOutbound: (item?: InventoryItem) => void;
  onQuickMutasi: () => void;
  onOpenLabelModal: (item: InventoryItem) => void;
  onOpenReturnLoan: (loan: LoanRecord) => void;
  onOpenEditItem: (item: InventoryItem) => void;
  onOpenShareModal: () => void;
  onOpenPublicForm?: (type: 'pinjam' | 'habis-pakai') => void;
  onAddToast?: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onNavigateTab,
  onQuickInbound,
  onQuickOutbound,
  onQuickMutasi,
  onOpenLabelModal,
  onOpenReturnLoan,
  onOpenEditItem,
  onOpenShareModal,
  onOpenPublicForm,
  onAddToast
}) => {
  const totalItems = state.items.length;
  const totalQty = calculateTotalQuantity(state.items);
  const totalAssetValue = calculateTotalAssetValue(state.items);
  const lowStockItems = getLowStockItems(state.items);
  const activeLoans = state.loans.filter(l => l.status === 'DIPINJAM' || l.status === 'TERLAMBAT');
  const overdueLoans = getOverdueLoans(state.loans, new Date().toISOString().split('T')[0]);
  const activeMaintenance = state.maintenance.filter(m => m.status === 'MENUNGGU' || m.status === 'DALAM_PENGERJAAN');

  // Recent 5 items
  const recentItems = [...state.items].slice(-5).reverse();

  const [copiedType, setCopiedType] = React.useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin + window.location.pathname
    : '';
  const loanUrl = `${baseUrl}?form=pinjam`;
  const consumableUrl = `${baseUrl}?form=habis-pakai`;

  const handleCopyLink = (url: string, type: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedType(type);
    if (onAddToast) {
      onAddToast(`Tautan ${label} berhasil disalin!`, 'success');
    }
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleShareWhatsApp = (title: string, url: string) => {
    const message = encodeURIComponent(
      `*LAYANAN ONLINE SARPRAS MTS MUHAMMADIYAH METRO*\n\n` +
      `Assalamu'alaikum Wr. Wb.\n` +
      `Bapak/Ibu Guru, Staf, dan Siswa dapat mengakses formulir online *${title}* melalui tautan berikut:\n\n` +
      `👉 ${url}\n\n` +
      `Mohon mengisi formulir sebelum mengambil barang di ruang Sarpras. Terima kasih.`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top 6 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Card 1: Total Jenis Barang */}
        <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl relative overflow-hidden group hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jenis Barang</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white font-heading">{totalItems}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Tercatat di sistem</p>
          </div>
        </div>

        {/* Card 2: Total Unit Fisik */}
        <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Fisik</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white font-heading">{totalQty}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Unit / Buah sarpras</p>
          </div>
        </div>

        {/* Card 3: Nilai Aset Madrasah */}
        <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nilai Aset</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-indigo-200 font-heading truncate" title={formatCurrencyIDR(totalAssetValue)}>
              {formatCurrencyIDR(totalAssetValue)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Estimasi aset sarpras</p>
          </div>
        </div>

        {/* Card 4: Stok Kritis */}
        <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stok Kritis</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-amber-300 font-heading">{lowStockItems.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Perlu pengadaan baru</p>
          </div>
        </div>

        {/* Card 5: Peminjaman Aktif */}
        <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peminjaman</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Handshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-purple-300 font-heading">{activeLoans.length}</h3>
              {overdueLoans.length > 0 && (
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
                  {overdueLoans.length} telat
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Sedang di luar sarpras</p>
          </div>
        </div>

        {/* Card 6: Servis / Perbaikan */}
        <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl relative overflow-hidden group hover:border-sky-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Perbaikan</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-sky-300 font-heading">{activeMaintenance.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Dalam pemeliharaan</p>
          </div>
        </div>

      </div>

      {/* Dedicated Online Links Banner on Dashboard */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-cyan-950/40 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-xl shadow-cyan-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-inner">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-heading">
                  Tautan Layanan Formulir Online Madrasah
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Langsung Aktif
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Bagikan link ini agar Guru, Staf, & Siswa dapat mengajukan peminjaman atau permohonan ATK langsung dari HP
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('portalLinks')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition self-start sm:self-auto px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Pusat Link & QR Code</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Card A: Peminjaman Barang */}
          <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-4 space-y-3 relative overflow-hidden hover:border-cyan-400/60 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Box className="w-4 h-4" />
                </div>
                <span className="font-bold text-white text-xs">1. Link Peminjaman Barang (Aset Tetap)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                Wajib Kembali
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Proyektor LCD, Laptop, Sound System, Mikroskop, Tenda Pramuka, Bola & Fasilitas Olahraga.
            </p>

            <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-white/10 font-mono-code text-[11px]">
              <span className="text-cyan-300 truncate flex-1 pl-1 select-all">{loanUrl}</span>
              <button
                onClick={() => handleCopyLink(loanUrl, 'pinjam', 'Formulir Peminjaman Barang')}
                className={`px-3 py-1.5 rounded-lg font-bold transition text-xs flex items-center gap-1 shrink-0 ${
                  copiedType === 'pinjam'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-600/30'
                }`}
              >
                {copiedType === 'pinjam' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'pinjam' ? 'Tersalin!' : 'Salin Link'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onOpenPublicForm?.('pinjam')}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-white/10"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Buka Form</span>
              </button>
              <button
                onClick={() => handleShareWhatsApp('Peminjaman Sarana Prasarana', loanUrl)}
                className="flex-1 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kirim via WA</span>
              </button>
            </div>
          </div>

          {/* Card B: Habis Pakai (BHP) */}
          <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 space-y-3 relative overflow-hidden hover:border-amber-400/60 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <PackageOpen className="w-4 h-4" />
                </div>
                <span className="font-bold text-white text-xs">2. Link Barang Habis Pakai (BHP/ATK)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                Habis Pakai
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Kertas HVS A4/F4, Spidol Whiteboard Snowman, Tinta Printer, Baterai Mic Wireless, Map Snelhecter.
            </p>

            <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-white/10 font-mono-code text-[11px]">
              <span className="text-amber-300 truncate flex-1 pl-1 select-all">{consumableUrl}</span>
              <button
                onClick={() => handleCopyLink(consumableUrl, 'habis-pakai', 'Formulir Barang Habis Pakai')}
                className={`px-3 py-1.5 rounded-lg font-bold transition text-xs flex items-center gap-1 shrink-0 ${
                  copiedType === 'habis-pakai'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm shadow-amber-600/30'
                }`}
              >
                {copiedType === 'habis-pakai' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'habis-pakai' ? 'Tersalin!' : 'Salin Link'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onOpenPublicForm?.('habis-pakai')}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-white/10"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Buka Form</span>
              </button>
              <button
                onClick={() => handleShareWhatsApp('Permintaan Barang Habis Pakai (BHP/ATK)', consumableUrl)}
                className="flex-1 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kirim via WA</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Aksi Cepat Manajemen Sarpras
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          
          <button
            onClick={() => onQuickInbound()}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 transition group"
          >
            <ArrowDownCircle className="w-5 h-5 mb-1.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Barang Masuk</span>
            <span className="text-[10px] text-emerald-400/80">Restock / BOS</span>
          </button>

          <button
            onClick={() => onQuickOutbound()}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition group"
          >
            <ArrowUpCircle className="w-5 h-5 mb-1.5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Barang Keluar</span>
            <span className="text-[10px] text-rose-400/80">Distribusi / Pakai</span>
          </button>

          <button
            onClick={onQuickMutasi}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 transition group"
          >
            <RefreshCw className="w-5 h-5 mb-1.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Mutasi Ruangan</span>
            <span className="text-[10px] text-cyan-400/80">Pindah Lokasi</span>
          </button>

          <button
            onClick={() => onNavigateTab('consumables')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 transition group"
          >
            <PackageOpen className="w-5 h-5 mb-1.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Habis Pakai</span>
            <span className="text-[10px] text-amber-400/80">BHP / ATK</span>
          </button>

          <button
            onClick={() => onNavigateTab('stockOpname')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 transition group"
          >
            <ClipboardCheck className="w-5 h-5 mb-1.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Stock Opname</span>
            <span className="text-[10px] text-indigo-400/80">Audit Fisik</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-200 transition group"
          >
            <Link2 className="w-5 h-5 mb-1.5 text-cyan-300 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Link Form Online</span>
            <span className="text-[10px] text-cyan-300/80">Pinjam & BHP</span>
          </button>

        </div>
      </div>

      {/* Main 2-Column Split: Recent Items vs Warnings & Overdue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Recent Inventory Table */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                Sarana & Prasarana Terbaru
              </h2>
              <p className="text-xs text-slate-400">
                Pencatatan inventaris dan pengadaan madrasah terbaru
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              <span>Semua Barang</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Kode & Nama</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3">Lokasi</th>
                  <th className="pb-3 text-center">Stok</th>
                  <th className="pb-3 text-center">Kondisi</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition">
                    <td className="py-3">
                      <span className="font-semibold text-slate-200 block text-sm">{item.name}</span>
                      <span className="text-[11px] text-cyan-400 font-mono-code">{item.code}</span>
                    </td>
                    <td className="py-3 text-slate-300">{item.category}</td>
                    <td className="py-3 text-slate-400">{item.location}</td>
                    <td className="py-3 text-center">
                      <span className="font-bold text-slate-100 px-2 py-0.5 rounded bg-slate-800">
                        {item.qty} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                        item.condition === 'Baik'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : item.condition === 'Kurang Baik'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                      }`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenLabelModal(item)}
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition"
                          title="Cetak Label Barcode Aset"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenEditItem(item)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                          title="Edit Barang"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Alerts & Overdue Monitor */}
        <div className="space-y-6">
          
          {/* Overdue Loans Card */}
          {overdueLoans.length > 0 && (
            <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Peminjaman Terlambat!</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {overdueLoans.length} Barang
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Peminjaman berikut telah melewati batas waktu pengembalian:
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {overdueLoans.map((loan) => (
                  <div key={loan.id} className="p-3 bg-slate-900/90 border border-rose-500/20 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-rose-200">{loan.itemName}</div>
                      <div className="text-[11px] text-slate-400">
                        {loan.borrower} ({loan.contact})
                      </div>
                      <div className="text-[10px] text-rose-400 mt-0.5 font-mono-code">
                        Jatuh tempo: {loan.dueDate}
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenReturnLoan(loan)}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shrink-0 transition"
                    >
                      Kembalikan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Stock Warning Card */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Peringatan Stok Menipis</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {lowStockItems.length} Barang
              </span>
            </div>

            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                Semua stok barang mencukupi batas minimum standar.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div>
                      <h4 className="font-semibold text-slate-200">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                        <span className="text-amber-400 font-bold">Sisa: {item.qty} {item.unit}</span>
                        <span className="text-slate-500">&bull;</span>
                        <span className="text-slate-400">Min: {item.minStock} {item.unit}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onQuickInbound(item)}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 rounded-lg text-xs font-medium transition shrink-0"
                    >
                      + Tambah Stok
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories Quick Stats */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Distribusi Kategori
              </h3>
              <button
                onClick={() => onNavigateTab('categories')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Kelola
              </button>
            </div>
            <div className="space-y-2">
              {state.categories.map((cat) => {
                const count = state.items.filter(i => i.category === cat).length;
                return (
                  <div key={cat} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-slate-300 truncate max-w-[200px]">{cat}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[11px]">
                      {count} jenis
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
