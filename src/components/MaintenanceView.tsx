import React, { useState } from 'react';
import type { MaintenanceRecord, MaintenanceStatus } from '../types/inventory.ts';
import { 
  Wrench, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  DollarSign, 
  Trash2,
  Edit2
} from 'lucide-react';
import { formatCurrencyIDR } from '../utils/inventoryLogic.ts';

interface MaintenanceViewProps {
  maintenance: MaintenanceRecord[];
  onOpenNewMaintenance: () => void;
  onUpdateStatus: (id: string, newStatus: MaintenanceStatus) => void;
  onDeleteMaintenance: (id: string) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  maintenance,
  onOpenNewMaintenance,
  onUpdateStatus,
  onDeleteMaintenance
}) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = maintenance.filter(m => {
    if (filter === 'ALL') return true;
    return m.status === filter;
  });

  const totalCost = maintenance.reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              <span>Pemeliharaan & Servis Sarana Prasarana</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Catatan perbaikan peralatan, AC, proyektor, mebelair, dan klaim garansi sarpras
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right pr-2">
              <span className="text-[11px] text-slate-400 block">Total Biaya Servis</span>
              <span className="text-sm font-bold text-amber-300 font-heading">
                {formatCurrencyIDR(totalCost)}
              </span>
            </div>
            <button
              onClick={onOpenNewMaintenance}
              className="bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-lg shadow-amber-600/25 flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Servis Baru</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filter === 'ALL' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Semua Servis ({maintenance.length})
          </button>
          <button
            onClick={() => setFilter('MENUNGGU')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filter === 'MENUNGGU' ? 'bg-slate-700 text-amber-300' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Menunggu Antrian
          </button>
          <button
            onClick={() => setFilter('DALAM_PENGERJAAN')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filter === 'DALAM_PENGERJAAN' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Sedang Dikerjakan
          </button>
          <button
            onClick={() => setFilter('SELESAI')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filter === 'SELESAI' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Selesai Diperbaiki
          </button>
        </div>
      </div>

      {/* Maintenance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-white/10">
            Tidak ada catatan servis pada filter ini.
          </div>
        ) : (
          filtered.map((item) => {
            const isPending = item.status === 'MENUNGGU';
            const isProgress = item.status === 'DALAM_PENGERJAAN';
            const isCompleted = item.status === 'SELESAI';

            return (
              <div key={item.id} className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-amber-500/40 transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-base">{item.itemName}</h3>
                    <span className="font-mono-code text-xs text-cyan-400">{item.itemCode}</span>
                  </div>
                  
                  {/* Status Dropdown / Badge */}
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.id, e.target.value as MaintenanceStatus)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-xl border focus:outline-none transition ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : isProgress
                        ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                        : isPending
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    <option value="MENUNGGU" className="bg-slate-900">Menunggu</option>
                    <option value="DALAM_PENGERJAAN" className="bg-slate-900">Dalam Pengerjaan</option>
                    <option value="SELESAI" className="bg-slate-900">Selesai</option>
                    <option value="TIDAK_DAPAT_DIPERBAIKI" className="bg-slate-900">Rusak Total / Afkir</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-800/60 rounded-xl text-xs text-slate-300 leading-relaxed">
                  <span className="text-slate-400 font-semibold block mb-0.5">Kerusakan / Keluhan:</span>
                  {item.issueDescription}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-white/5">
                  <div>
                    <span className="text-slate-500 block">Tgl Lapor</span>
                    <span className="text-slate-300 font-mono-code">{item.reportedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Estimasi Biaya</span>
                    <span className="text-amber-300 font-bold">{formatCurrencyIDR(item.cost || 0)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Teknisi / Vendor</span>
                    <span className="text-slate-300">{item.technician || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Petugas Sarpras</span>
                    <span className="text-slate-300">{item.petugas}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => onDeleteMaintenance(item.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Catatan</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
