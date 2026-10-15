import React, { useState, useMemo } from 'react';
import type { TransactionRecord, TransactionType } from '../types/inventory.ts';
import { 
  History, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  RefreshCw, 
  Trash, 
  Search, 
  Plus, 
  Minus 
} from 'lucide-react';

interface TransactionsViewProps {
  transactions: TransactionRecord[];
  onOpenInbound: () => void;
  onOpenOutbound: () => void;
  onOpenMutasi: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onOpenInbound,
  onOpenOutbound,
  onOpenMutasi
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.itemName.toLowerCase().includes(search.toLowerCase()) ||
        tx.itemCode.toLowerCase().includes(search.toLowerCase()) ||
        tx.sourceOrDestination.toLowerCase().includes(search.toLowerCase()) ||
        tx.petugas.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;
      if (filterType === 'ALL') return true;
      return tx.type === filterType;
    });
  }, [transactions, search, filterType]);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              <span>Riwayat Transaksi & Log Mutasi Sarpras</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Log otomatis setiap pergerakan barang: pengadaan masuk, distribusi keluar, mutasi, dan afkir
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenInbound}
              className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
              <span>Barang Masuk</span>
            </button>
            <button
              onClick={onOpenOutbound}
              className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <ArrowUpCircle className="w-4 h-4 text-rose-400" />
              <span>Barang Keluar</span>
            </button>
            <button
              onClick={onOpenMutasi}
              className="px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Mutasi Ruangan</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterType === 'ALL'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua Transaksi
            </button>
            <button
              onClick={() => setFilterType('IN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterType === 'IN'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-emerald-300 hover:bg-emerald-950/40'
              }`}
            >
              Masuk (IN)
            </button>
            <button
              onClick={() => setFilterType('OUT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterType === 'OUT'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-rose-300 hover:bg-rose-950/40'
              }`}
            >
              Keluar (OUT)
            </button>
            <button
              onClick={() => setFilterType('MUTASI')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterType === 'MUTASI'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-indigo-300 hover:bg-indigo-950/40'
              }`}
            >
              Mutasi Ruangan
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari transaksi, barang, atau petugas..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Waktu Transaksi</th>
                <th className="py-3.5 px-4">Jenis</th>
                <th className="py-3.5 px-4">Barang & Kode</th>
                <th className="py-3.5 px-4 text-center">Jumlah</th>
                <th className="py-3.5 px-4">Sumber / Tujuan / Keterangan</th>
                <th className="py-3.5 px-4">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Belum ada riwayat transaksi yang tercatat.
                  </td>
                </tr>
              ) : (
                [...filteredTransactions].reverse().map((tx) => {
                  const isIncoming = tx.type === 'IN';
                  const isMutasi = tx.type === 'MUTASI';

                  return (
                    <tr key={tx.id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-mono-code text-slate-400 text-[11px]">
                        {tx.date}
                      </td>
                      <td className="py-3.5 px-4">
                        {isIncoming ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Plus className="w-3 h-3" />
                            <span>MASUK</span>
                          </span>
                        ) : isMutasi ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            <RefreshCw className="w-3 h-3" />
                            <span>MUTASI</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <Minus className="w-3 h-3" />
                            <span>KELUAR</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{tx.itemName}</div>
                        <span className="text-[11px] text-cyan-400 font-mono-code">{tx.itemCode}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`font-bold text-sm ${
                          isIncoming ? 'text-emerald-400' : isMutasi ? 'text-indigo-300' : 'text-rose-400'
                        }`}>
                          {isIncoming ? `+${tx.qty}` : isMutasi ? `${tx.qty}` : `-${tx.qty}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <p className="font-medium">{tx.sourceOrDestination}</p>
                        {tx.notes && <p className="text-[10px] text-slate-500 mt-0.5">{tx.notes}</p>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-medium text-[11px]">
                        {tx.petugas}
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
