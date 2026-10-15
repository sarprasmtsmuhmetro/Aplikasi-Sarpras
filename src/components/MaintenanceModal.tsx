import React, { useState } from 'react';
import type { InventoryItem, MaintenanceRecord } from '../types/inventory.ts';
import { X, Wrench, Check } from 'lucide-react';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  onSaveMaintenance: (record: Omit<MaintenanceRecord, 'id' | 'status'>) => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  onClose,
  items,
  onSaveMaintenance
}) => {
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || '');
  const [issueDescription, setIssueDescription] = useState('');
  const [cost, setCost] = useState<number>(0);
  const [technician, setTechnician] = useState('');
  const [petugas, setPetugas] = useState('M. Rizqi (Staf Sarpras)');

  if (!isOpen) return null;

  const currentItem = items.find(i => i.id === selectedItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem || !issueDescription.trim()) return;

    onSaveMaintenance({
      itemId: currentItem.id,
      itemCode: currentItem.code,
      itemName: currentItem.name,
      issueDescription: issueDescription.trim(),
      reportedDate: new Date().toISOString().split('T')[0],
      cost: Number(cost) || 0,
      technician: technician.trim() || undefined,
      petugas: petugas.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden my-8 animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-base font-heading">
              Lapor Pemeliharaan & Perbaikan Sarpras
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition p-1"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Pilih Sarana / Prasarana Rusak *
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.code} - {i.name} (Lokasi: {i.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Rincian Kerusakan & Keluhan Teknis *
            </label>
            <textarea
              rows={3}
              required
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Contoh: Layar proyektor bergaris dan lampu indikator merah berkedip, butuh penggantian optik..."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-amber-400 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Estimasi Biaya Servis (Rp)
              </label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Teknisi / Vendor Servis
              </label>
              <input
                type="text"
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                placeholder="Nama bengkel / teknisi rekanan"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Petugas Pelapor *
            </label>
            <input
              type="text"
              required
              value={petugas}
              onChange={(e) => setPetugas(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
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
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition font-bold shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Laporan Servis</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
