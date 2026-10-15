import React, { useState, useEffect } from 'react';
import type { InventoryItem, TransactionType } from '../types/inventory.ts';
import { X, ArrowDownCircle, ArrowUpCircle, RefreshCw, Check } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  items: InventoryItem[];
  locations: string[];
  preselectedItem?: InventoryItem | null;
  onConfirmTransaction: (data: {
    type: TransactionType;
    itemId: string;
    qty: number;
    sourceOrDestination: string;
    targetLocation?: string;
    petugas: string;
    notes?: string;
  }) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  type,
  items,
  locations,
  preselectedItem,
  onConfirmTransaction
}) => {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [qty, setQty] = useState(1);
  const [sourceOrDest, setSourceOrDest] = useState('');
  const [targetLocation, setTargetLocation] = useState('');
  const [petugas, setPetugas] = useState('M. Rizqi (Staf Sarpras)');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (preselectedItem) {
      setSelectedItemId(preselectedItem.id);
    } else if (items.length > 0) {
      setSelectedItemId(items[0].id);
    }

    if (type === 'IN') {
      setSourceOrDest('Pengadaan Anggaran BOS / Yayasan');
    } else if (type === 'OUT') {
      setSourceOrDest('Distribusi Ruangan / Kegiatan Madrasah');
    } else if (type === 'MUTASI') {
      setSourceOrDest('Pemindahan Lokasi Inventaris');
      setTargetLocation(locations[1] || locations[0] || '');
    }
    setQty(1);
  }, [type, preselectedItem, items, locations, isOpen]);

  if (!isOpen) return null;

  const currentItem = items.find(i => i.id === selectedItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    if (type === 'OUT' && qty > currentItem.qty) {
      alert(`Stok tidak mencukupi! Tersedia hanya ${currentItem.qty} ${currentItem.unit}.`);
      return;
    }

    onConfirmTransaction({
      type,
      itemId: currentItem.id,
      qty,
      sourceOrDestination: sourceOrDest,
      targetLocation: type === 'MUTASI' ? targetLocation : undefined,
      petugas,
      notes
    });

    onClose();
  };

  const title = type === 'IN' 
    ? 'Catat Barang Masuk (Inbound)' 
    : type === 'OUT' 
    ? 'Catat Barang Keluar (Outbound)' 
    : 'Catat Mutasi Ruangan Sarpras';

  const headerGradient = type === 'IN'
    ? 'from-emerald-600 to-teal-600'
    : type === 'OUT'
    ? 'from-rose-600 to-amber-600'
    : 'from-cyan-600 to-indigo-600';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden my-8 animate-fade-in">
        
        {/* Header */}
        <div className={`px-6 py-4 bg-gradient-to-r ${headerGradient} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            {type === 'IN' && <ArrowDownCircle className="w-5 h-5 text-emerald-200" />}
            {type === 'OUT' && <ArrowUpCircle className="w-5 h-5 text-rose-200" />}
            {type === 'MUTASI' && <RefreshCw className="w-5 h-5 text-cyan-200" />}
            <h3 className="font-bold text-base font-heading">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition p-1"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Select Item */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Pilih Barang Sarpras *
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.code} - {i.name} (Stok Saat Ini: {i.qty} {i.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Current Location Info */}
          {currentItem && (
            <div className="px-3 py-2 rounded-xl bg-slate-800/60 border border-white/5 flex justify-between text-slate-300">
              <span>Lokasi Saat Ini:</span>
              <span className="font-semibold text-cyan-300">{currentItem.location}</span>
            </div>
          )}

          {/* Mutasi Target Location */}
          {type === 'MUTASI' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Pindahkan ke Lokasi / Ruangan Baru *
              </label>
              <select
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              >
                {locations.filter(loc => loc !== currentItem?.location).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Jumlah Unit *
            </label>
            <input
              type="number"
              min="1"
              max={type === 'OUT' || type === 'MUTASI' ? currentItem?.qty || 999 : 9999}
              required
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white font-bold text-center focus:border-cyan-400 focus:outline-none text-sm"
            />
          </div>

          {/* Source or Destination */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              {type === 'IN' ? 'Sumber Pengadaan / Supplier *' : type === 'OUT' ? 'Tujuan Distribusi / Pemakai *' : 'Alasan Pemindahan *'}
            </label>
            <input
              type="text"
              required
              value={sourceOrDest}
              onChange={(e) => setSourceOrDest(e.target.value)}
              placeholder="Contoh: Pengadaan BOS Tahap I / Pemakaian Acara Wisuda"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Staff */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Petugas Penanggung Jawab *
            </label>
            <input
              type="text"
              required
              value={petugas}
              onChange={(e) => setPetugas(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Catatan Dokumen / Berita Acara
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nomor faktur, nomor surat serah terima..."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-white transition font-bold shadow-lg flex items-center gap-1.5 ${
                type === 'IN' 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' 
                  : type === 'OUT' 
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Simpan Transaksi</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
