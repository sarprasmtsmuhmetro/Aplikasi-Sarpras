import React, { useState, useMemo } from 'react';
import type { InventoryItem, ConsumableRequest } from '../types/inventory.ts';
import { 
  PackageOpen, 
  Plus, 
  Search, 
  Share2, 
  Printer, 
  ArrowDownCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ClipboardList, 
  User, 
  Tag 
} from 'lucide-react';
import { formatCurrencyIDR, calculateTotalQuantity, filterConsumables } from '../utils/inventoryLogic.ts';

interface ConsumablesViewProps {
  items: InventoryItem[];
  requests: ConsumableRequest[];
  onOpenNewRequest: () => void;
  onOpenRestock: () => void;
  onOpenShareModal: () => void;
  onPrintSlip: (request: ConsumableRequest) => void;
}

export const ConsumablesView: React.FC<ConsumablesViewProps> = ({
  items,
  requests,
  onOpenNewRequest,
  onOpenRestock,
  onOpenShareModal,
  onPrintSlip
}) => {
  const [subTab, setSubTab] = useState<'stok' | 'riwayat'>('stok');
  const [search, setSearch] = useState('');

  const consumableItems = useMemo(() => filterConsumables(items), [items]);

  const filteredItems = useMemo(() => {
    return consumableItems.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      (item.desc && item.desc.toLowerCase().includes(search.toLowerCase()))
    );
  }, [consumableItems, search]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req =>
      req.applicant.toLowerCase().includes(search.toLowerCase()) ||
      req.itemName.toLowerCase().includes(search.toLowerCase()) ||
      req.requestNumber.toLowerCase().includes(search.toLowerCase()) ||
      req.unitOrClass.toLowerCase().includes(search.toLowerCase())
    );
  }, [requests, search]);

  const totalBhpItems = consumableItems.length;
  const totalBhpQty = calculateTotalQuantity(consumableItems);
  const lowBhpItems = consumableItems.filter(i => i.qty <= i.minStock);
  const totalRequestsCount = requests.length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Controls */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <PackageOpen className="w-5 h-5 text-amber-400" />
              <span>Manajemen Barang Habis Pakai (BHP / ATK)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Kelola stok kertas, spidol, baterai, tinta printer, dan distribusi pemakaian operasional madrasah
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenShareModal}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5"
              title="Bagikan Link Form Online Permintaan BHP ke WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Link Form Online</span>
            </button>

            <button
              onClick={onOpenRestock}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1.5"
            >
              <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restock / Masuk</span>
            </button>

            <button
              onClick={onOpenNewRequest}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white transition flex items-center gap-1.5 shadow-md shadow-amber-600/25"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pengeluaran BHP</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
            <span className="text-[11px] text-slate-400 block">Jenis Barang Habis Pakai</span>
            <span className="text-xl font-bold text-white font-heading mt-0.5 block">{totalBhpItems}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
            <span className="text-[11px] text-slate-400 block">Total Stok Fisik Tersedia</span>
            <span className="text-xl font-bold text-emerald-300 font-heading mt-0.5 block">{totalBhpQty}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
            <span className="text-[11px] text-slate-400 block">Permintaan Terlayani</span>
            <span className="text-xl font-bold text-indigo-300 font-heading mt-0.5 block">{totalRequestsCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
            <span className="text-[11px] text-slate-400 block">Stok BHP Kritis / Menipis</span>
            <span className="text-xl font-bold text-amber-300 font-heading mt-0.5 block">{lowBhpItems.length}</span>
          </div>
        </div>

        {/* Sub-Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubTab('stok')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition ${
                subTab === 'stok'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Katalog Stok BHP ({consumableItems.length})
            </button>
            <button
              onClick={() => setSubTab('riwayat')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition ${
                subTab === 'riwayat'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Riwayat Distribusi / Pemakaian ({requests.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama barang atau pemohon..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder-slate-400 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* View 1: Stok Barang Habis Pakai */}
      {subTab === 'stok' && (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/60 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Kode & Nama BHP</th>
                  <th className="py-3.5 px-4">Lokasi Penyimpanan</th>
                  <th className="py-3.5 px-4 text-center">Stok Sisa</th>
                  <th className="py-3.5 px-4 text-right">Harga Satuan</th>
                  <th className="py-3.5 px-4">Keterangan / Spesifikasi</th>
                  <th className="py-3.5 px-4 text-center">Status Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      Tidak ada barang habis pakai yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const isLow = item.qty <= item.minStock;
                    return (
                      <tr key={item.id} className="hover:bg-white/5 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-100 text-sm block">{item.name}</span>
                          <span className="font-mono-code text-[11px] text-amber-400">{item.code}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {item.location}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`font-bold text-sm px-2.5 py-0.5 rounded-lg ${
                            isLow ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-200'
                          }`}>
                            {item.qty} {item.unit}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-slate-200">
                          {formatCurrencyIDR(item.pricePerUnit || 0)}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 max-w-[240px]">
                          <p className="truncate" title={item.desc}>{item.desc || '-'}</p>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Stok Menipis</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Mencukupi</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Riwayat Permintaan / Distribusi */}
      {subTab === 'riwayat' && (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/60 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">No. Registrasi & Tgl</th>
                  <th className="py-3.5 px-4">Pemohon & Unit</th>
                  <th className="py-3.5 px-4">Barang Habis Pakai</th>
                  <th className="py-3.5 px-4 text-center">Jumlah</th>
                  <th className="py-3.5 px-4">Keperluan Pemakaian</th>
                  <th className="py-3.5 px-4">Status & Petugas</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Belum ada riwayat distribusi barang habis pakai.
                    </td>
                  </tr>
                ) : (
                  [...filteredRequests].reverse().map((req) => (
                    <tr key={req.id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono-code font-bold text-amber-300 block">{req.requestNumber}</span>
                        <span className="font-mono-code text-[11px] text-slate-400">{req.requestDate}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-100 block">{req.applicant}</span>
                        <span className="text-[11px] text-slate-400">{req.unitOrClass} ({req.contact})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200">{req.itemName}</span>
                        <span className="font-mono-code text-[11px] text-slate-400 block">{req.itemCode}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-sm text-slate-100 bg-slate-800 px-2 py-0.5 rounded">
                          {req.qty} {req.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-[200px]">
                        <p className="truncate" title={req.purpose}>{req.purpose}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {req.status}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Oleh: {req.petugas}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onPrintSlip(req)}
                          className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                          title="Cetak Tanda Terima BHP"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
