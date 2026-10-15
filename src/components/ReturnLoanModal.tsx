import React, { useState } from 'react';
import type { LoanRecord, ItemCondition } from '../types/inventory.ts';
import { X, RotateCcw, Check } from 'lucide-react';

interface ReturnLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanRecord | null;
  onConfirmReturn: (loanId: string, returnData: {
    returnDate: string;
    conditionOnReturn: ItemCondition;
    notes?: string;
    petugas: string;
  }) => void;
}

export const ReturnLoanModal: React.FC<ReturnLoanModalProps> = ({
  isOpen,
  onClose,
  loan,
  onConfirmReturn
}) => {
  const [returnDate, setReturnDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [conditionOnReturn, setConditionOnReturn] = useState<ItemCondition>('Baik');
  const [notes, setNotes] = useState('Barang diperiksa lengkap, fungsi normal');
  const [petugas, setPetugas] = useState('M. Rizqi (Staf Sarpras)');

  if (!isOpen || !loan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReturn(loan.id, {
      returnDate,
      conditionOnReturn,
      notes,
      petugas
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden my-8 animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base font-heading">
              Konfirmasi Pengembalian Barang
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white transition p-1"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Summary Box */}
          <div className="p-3.5 bg-slate-800/80 border border-white/10 rounded-2xl space-y-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-400">Peminjam:</span>
              <span className="font-bold text-slate-100">{loan.borrower} ({loan.role})</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-400">Barang Sarpras:</span>
              <span className="font-semibold text-cyan-300">{loan.itemName}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-400">Jumlah Unit:</span>
              <span className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded text-[11px]">
                {loan.qty} unit
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-400">Batas Waktu:</span>
              <span className="font-mono-code text-amber-300">{loan.dueDate}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Tanggal Pengembalian Riil *
            </label>
            <input
              type="date"
              required
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-mono-code"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Kondisi Fisik Saat Dikembalikan *
            </label>
            <select
              value={conditionOnReturn}
              onChange={(e) => setConditionOnReturn(e.target.value as ItemCondition)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="Baik">Baik (Sempurna / Tanpa Kerusakan)</option>
              <option value="Kurang Baik">Kurang Baik (Ada Baret / Perlu Pembersihan)</option>
              <option value="Rusak Berat">Rusak Berat (Tidak Berfungsi / Patah)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Catatan Pemeriksaan Barang
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Kelengkapan aksesoris, kabel, charger..."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Petugas Penerima Pengembalian *
            </label>
            <input
              type="text"
              required
              value={petugas}
              onChange={(e) => setPetugas(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Selesaikan Pengembalian</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
