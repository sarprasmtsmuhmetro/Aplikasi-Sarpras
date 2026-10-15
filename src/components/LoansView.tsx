import React, { useState, useMemo } from 'react';
import type { LoanRecord, LoanStatus } from '../types/inventory.ts';
import { 
  Handshake, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Printer, 
  Trash2, 
  RotateCcw,
  UserCheck
} from 'lucide-react';

interface LoansViewProps {
  loans: LoanRecord[];
  onOpenNewLoan: () => void;
  onOpenReturnLoan: (loan: LoanRecord) => void;
  onPrintReceipt: (loan: LoanRecord) => void;
  onDeleteLoan: (id: string, borrower: string) => void;
}

export const LoansView: React.FC<LoansViewProps> = ({
  loans,
  onOpenNewLoan,
  onOpenReturnLoan,
  onPrintReceipt,
  onDeleteLoan
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchSearch =
        loan.borrower.toLowerCase().includes(search.toLowerCase()) ||
        loan.itemName.toLowerCase().includes(search.toLowerCase()) ||
        loan.contact.toLowerCase().includes(search.toLowerCase()) ||
        loan.itemCode.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (filterStatus === 'ALL') return true;
      if (filterStatus === 'ACTIVE') return loan.status === 'DIPINJAM' || loan.status === 'TERLAMBAT';
      if (filterStatus === 'OVERDUE') return loan.status === 'TERLAMBAT' || (loan.status === 'DIPINJAM' && loan.dueDate < today);
      if (filterStatus === 'RETURNED') return loan.status === 'DIKEMBALIKAN';

      return true;
    });
  }, [loans, search, filterStatus, today]);

  const activeCount = loans.filter(l => l.status === 'DIPINJAM' || l.status === 'TERLAMBAT').length;
  const overdueCount = loans.filter(l => l.status === 'TERLAMBAT' || (l.status === 'DIPINJAM' && l.dueDate < today)).length;
  const returnedCount = loans.filter(l => l.status === 'DIKEMBALIKAN').length;

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Handshake className="w-5 h-5 text-cyan-400" />
              <span>Manajemen Peminjaman Sarana & Prasarana</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pantau sirkulasi peminjaman aset oleh guru, siswa, staf madrasah, dan organisasi IPM
            </p>
          </div>

          <button
            onClick={onOpenNewLoan}
            className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-lg shadow-cyan-600/25 flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Peminjaman Baru</span>
          </button>
        </div>

        {/* Filter Pills and Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-white/5">
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterStatus === 'ALL'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua ({loans.length})
            </button>

            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterStatus === 'ACTIVE'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Dipinjam / Aktif ({activeCount})
            </button>

            <button
              onClick={() => setFilterStatus('OVERDUE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterStatus === 'OVERDUE'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-800 text-rose-300 hover:bg-rose-950/40'
              }`}
            >
              Terlambat ({overdueCount})
            </button>

            <button
              onClick={() => setFilterStatus('RETURNED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterStatus === 'RETURNED'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Selesai Dikembalikan ({returnedCount})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari peminjam, kelas, barang..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>

        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Peminjam & Kontak</th>
                <th className="py-3.5 px-4">Nama Sarpras & Kode</th>
                <th className="py-3.5 px-4 text-center">Jumlah</th>
                <th className="py-3.5 px-4">Jadwal Pinjam & Batas</th>
                <th className="py-3.5 px-4">Keperluan</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <UserCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-300 text-sm">Tidak ada catatan peminjaman</p>
                    <p className="text-xs text-slate-500 mt-1">Belum ada peminjaman dalam kategori filter ini</p>
                  </td>
                </tr>
              ) : (
                [...filteredLoans].reverse().map((loan) => {
                  const isOverdue = loan.status === 'TERLAMBAT' || (loan.status === 'DIPINJAM' && loan.dueDate < today);
                  const isReturned = loan.status === 'DIKEMBALIKAN';

                  return (
                    <tr key={loan.id} className="hover:bg-white/5 transition">
                      
                      {/* Borrower */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100 text-sm">{loan.borrower}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-cyan-300 border border-cyan-800/40">
                            {loan.role}
                          </span>
                          <span className="text-[11px] text-slate-400">{loan.contact}</span>
                        </div>
                      </td>

                      {/* Item */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{loan.itemName}</div>
                        <span className="text-[11px] text-cyan-400 font-mono-code">{loan.itemCode}</span>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-sm text-slate-100 px-2 py-0.5 rounded bg-slate-800">
                          {loan.qty}
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 font-mono-code text-[11px]">
                          Pinjam: {loan.borrowDate}
                        </div>
                        <div className={`font-mono-code text-[11px] font-semibold mt-0.5 ${
                          isReturned ? 'text-slate-400' : isOverdue ? 'text-rose-400' : 'text-amber-400'
                        }`}>
                          Batas: {loan.dueDate}
                        </div>
                        {loan.returnDate && (
                          <div className="text-[10px] text-emerald-400 font-mono-code mt-0.5">
                            Kembali: {loan.returnDate}
                          </div>
                        )}
                      </td>

                      {/* Purpose */}
                      <td className="py-3.5 px-4 text-slate-300 max-w-[200px]">
                        <p className="truncate" title={loan.purpose}>{loan.purpose || '-'}</p>
                        <span className="text-[10px] text-slate-500 block">Petugas: {loan.petugas}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isReturned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" />
                            <span>DIKEMBALIKAN</span>
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            <span>TERLAMBAT</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            <Clock className="w-3 h-3" />
                            <span>DIPINJAM</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Return Button */}
                          {!isReturned && (
                            <button
                              onClick={() => onOpenReturnLoan(loan)}
                              className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                              title="Catat Pengembalian Barang"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Kembalikan</span>
                            </button>
                          )}

                          {/* Print Receipt */}
                          <button
                            onClick={() => onPrintReceipt(loan)}
                            className="p-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition"
                            title="Cetak Surat Bukti Peminjaman"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Delete Loan Record */}
                          <button
                            onClick={() => onDeleteLoan(loan.id, loan.borrower)}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            title="Hapus Catatan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
