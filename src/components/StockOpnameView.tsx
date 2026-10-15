import React, { useState } from 'react';
import type { InventoryItem } from '../types/inventory.ts';
import { 
  ClipboardCheck, 
  Download, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { exportStockOpnameTemplate } from '../utils/excelHelper.ts';

interface StockOpnameViewProps {
  items: InventoryItem[];
  onApplyStockOpname: (adjustments: { id: string; newQty: number; note: string }[]) => void;
}

export const StockOpnameView: React.FC<StockOpnameViewProps> = ({
  items,
  onApplyStockOpname
}) => {
  const [counts, setCounts] = useState<{ [id: string]: number }>(() => {
    const initial: { [id: string]: number } = {};
    items.forEach(item => {
      initial[item.id] = item.qty;
    });
    return initial;
  });

  const [notes, setNotes] = useState<{ [id: string]: string }>({});
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const locations = Array.from(new Set(items.map(i => i.location)));

  const filteredItems = items.filter(i => {
    if (!selectedLocation) return true;
    return i.location === selectedLocation;
  });

  const handleQtyChange = (id: string, val: string) => {
    const num = parseInt(val) || 0;
    setCounts(prev => ({ ...prev, [id]: num }));
  };

  const handleNoteChange = (id: string, val: string) => {
    setNotes(prev => ({ ...prev, [id]: val }));
  };

  const discrepancies = items.filter(item => {
    const physical = counts[item.id] !== undefined ? counts[item.id] : item.qty;
    return physical !== item.qty;
  });

  const handleApply = () => {
    const adjustments = discrepancies.map(item => ({
      id: item.id,
      newQty: counts[item.id],
      note: notes[item.id] || 'Penyesuaian hasil audit stock opname fisik'
    }));

    if (adjustments.length === 0) {
      alert('Tidak ada selisih stok fisik dengan data sistem.');
      return;
    }

    if (confirm(`Terapkan penyesuaian stok untuk ${adjustments.length} barang ke database inventaris?`)) {
      onApplyStockOpname(adjustments);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Opname Header */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-indigo-400" />
              <span>Stock Opname & Audit Fisik Sarpras</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pengecekan kesesuaian antara jumlah barang di sistem dengan kondisi fisik nyata di lapangan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportStockOpnameTemplate(items)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Unduh Format Excel</span>
            </button>
            <button
              onClick={handleApply}
              disabled={discrepancies.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Terapkan Penyesuaian ({discrepancies.length})</span>
            </button>
          </div>
        </div>

        {/* Location selector */}
        <div className="flex items-center gap-3 pt-3 border-t border-white/5 text-xs">
          <label className="text-slate-400 font-semibold">Filter Per Ruangan:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Semua Ruangan & Lokasi</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {discrepancies.length > 0 && (
            <span className="text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[11px] ml-auto">
              Ditemukan {discrepancies.length} selisih stok
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Kode & Nama Sarpras</th>
                <th className="py-3.5 px-4">Lokasi</th>
                <th className="py-3.5 px-4 text-center">Stok Sistem</th>
                <th className="py-3.5 px-4 text-center">Jumlah Fisik Riil</th>
                <th className="py-3.5 px-4 text-center">Selisih</th>
                <th className="py-3.5 px-4">Catatan Temuan / Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((item) => {
                const physical = counts[item.id] !== undefined ? counts[item.id] : item.qty;
                const diff = physical - item.qty;

                return (
                  <tr key={item.id} className="hover:bg-white/5 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{item.name}</div>
                      <span className="text-[11px] text-cyan-400 font-mono-code">{item.code}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-200">
                      {item.qty} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        value={counts[item.id] !== undefined ? counts[item.id] : item.qty}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        className="w-20 px-2 py-1 text-center font-bold text-white bg-slate-800 border border-white/20 rounded-lg focus:border-cyan-400 focus:outline-none"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {diff === 0 ? (
                        <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
                          Sesuai (0)
                        </span>
                      ) : diff > 0 ? (
                        <span className="text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-[11px]">
                          Lebih (+{diff})
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-[11px]">
                          Kurang ({diff})
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        value={notes[item.id] || ''}
                        onChange={(e) => handleNoteChange(item.id, e.target.value)}
                        placeholder="Contoh: 1 unit dipinjam di Lab, baut lepas..."
                        className="w-full px-2.5 py-1 text-xs text-slate-200 bg-slate-800/80 border border-white/10 rounded-lg focus:border-cyan-400 focus:outline-none placeholder-slate-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
