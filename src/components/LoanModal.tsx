import React, { useState } from 'react';
import type { InventoryItem, LoanRecord } from '../types/inventory.ts';
import { X, Handshake, Check, AlertCircle } from 'lucide-react';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLoan: (loanData: Omit<LoanRecord, 'id' | 'status'>) => void;
  items: InventoryItem[];
}

export const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  onClose,
  onSaveLoan,
  items
}) => {
  const [borrower, setBorrower] = useState('');
  const [role, setRole] = useState<'Guru' | 'Siswa' | 'Staf / Karyawan' | 'Organisasi / IPM' | 'Lainnya'>('Guru');
  const [contact, setContact] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || '');
  const [qty, setQty] = useState(1);
  const [borrowDate, setBorrowDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [purpose, setPurpose] = useState('');
  const [petugas, setPetugas] = useState('M. Rizqi (Staf Sarpras)');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const selectedItem = items.find(i => i.id === selectedItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedItem) {
      setErrorMsg('Pilih barang yang akan dipinjam.');
      return;
    }

    if (qty <= 0) {
      setErrorMsg('Jumlah pinjam harus minimal 1 unit.');
      return;
    }

    if (qty > selectedItem.qty) {
      setErrorMsg(`Stok tidak mencukupi! Tersedia hanya ${selectedItem.qty} ${selectedItem.unit}.`);
      return;
    }

    onSaveLoan({
      borrower: borrower.trim(),
      role,
      contact: contact.trim(),
      itemId: selectedItem.id,
      itemCode: selectedItem.code,
      itemName: selectedItem.name,
      qty,
      borrowDate,
      dueDate,
      purpose: purpose.trim(),
      petugas: petugas.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden my-8 animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Handshake className="w-5 h-5 text-cyan-200" />
            <h3 className="font-bold text-base font-heading">
              Formulir Peminjaman Sarpras Madrasah
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-cyan-200 hover:text-white transition p-1"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Row 1: Borrower & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Nama Peminjam *
              </label>
              <input
                type="text"
                required
                value={borrower}
                onChange={(e) => setBorrower(e.target.value)}
                placeholder="Nama Guru / Siswa / Ekskul"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Kategori Peminjam *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="Guru">Guru / Tenaga Pendidik</option>
                <option value="Siswa">Siswa / Peserta Didik</option>
                <option value="Staf / Karyawan">Staf / Tenaga Kependidikan</option>
                <option value="Organisasi / IPM">Organisasi / IPM / HW / TS</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Row 2: Contact / Class */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Kontak WhatsApp / Rombel Kelas *
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contoh: 0812-3456-7890 (Wali Kelas IX C)"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Row 3: Select Item */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Pilih Sarana / Prasarana *
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
            >
              {items.map((item) => (
                <option key={item.id} value={item.id} disabled={item.qty <= 0}>
                  {item.code} - {item.name} (Tersedia: {item.qty} {item.unit}) {item.qty <= 0 ? '[HABIS]' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Row 4: Quantity & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Jumlah Unit *
              </label>
              <input
                type="number"
                min="1"
                max={selectedItem?.qty || 999}
                required
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white font-bold text-center focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Tgl Pinjam *
              </label>
              <input
                type="date"
                required
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-mono-code"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Batas Pengembalian *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-mono-code"
              />
            </div>
          </div>

          {/* Row 5: Purpose */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Keperluan / Kegiatan Pembelajaran *
            </label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Contoh: Pembelajaran Presentasi Fiqih di Smart Class"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Row 6: Staff */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Petugas Sarpras yang Menyerahkan *
            </label>
            <input
              type="text"
              required
              value={petugas}
              onChange={(e) => setPetugas(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white transition font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Peminjaman</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
