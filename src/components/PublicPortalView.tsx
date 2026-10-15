import React, { useState } from 'react';
import type { InventoryItem, LoanRecord, ConsumableRequest } from '../types/inventory.ts';
import { 
  Building2, 
  Box, 
  PackageOpen, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Send, 
  Calendar, 
  User, 
  Phone, 
  BookOpen, 
  ShieldCheck, 
  Share2,
  Link2,
  Copy,
  Check
} from 'lucide-react';
import { generateRequestNumber, filterFixedAssets, filterConsumables } from '../utils/inventoryLogic.ts';

interface PublicPortalViewProps {
  initialFormType: 'pinjam' | 'habis-pakai';
  items: InventoryItem[];
  existingLoans: LoanRecord[];
  existingRequests: ConsumableRequest[];
  onBackToAdmin: () => void;
  onSubmitLoan: (loanData: Omit<LoanRecord, 'id' | 'status'>) => void;
  onSubmitConsumableRequest: (requestData: Omit<ConsumableRequest, 'id'>) => void;
}

export const PublicPortalView: React.FC<PublicPortalViewProps> = ({
  initialFormType,
  items,
  existingLoans,
  existingRequests,
  onBackToAdmin,
  onSubmitLoan,
  onSubmitConsumableRequest
}) => {
  const [activeForm, setActiveForm] = useState<'pinjam' | 'habis-pakai'>(initialFormType);

  // Loan Form State
  const [loanApplicant, setLoanApplicant] = useState('');
  const [loanRole, setLoanRole] = useState<'Guru' | 'Siswa' | 'Staf / Karyawan' | 'Organisasi / IPM' | 'Lainnya'>('Guru');
  const [loanContact, setLoanContact] = useState('');
  const [loanItemId, setLoanItemId] = useState(() => {
    const assets = filterFixedAssets(items);
    return assets[0]?.id || '';
  });
  const [loanQty, setLoanQty] = useState(1);
  const [loanBorrowDate, setLoanBorrowDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loanDueDate, setLoanDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [loanPurpose, setLoanPurpose] = useState('');

  // Consumable Form State
  const [bhpApplicant, setBhpApplicant] = useState('');
  const [bhpRole, setBhpRole] = useState<'Guru' | 'Siswa' | 'Staf / Karyawan' | 'Organisasi / IPM' | 'Lainnya'>('Guru');
  const [bhpUnitClass, setBhpUnitClass] = useState('');
  const [bhpContact, setBhpContact] = useState('');
  const [bhpItemId, setBhpItemId] = useState(() => {
    const consumables = filterConsumables(items);
    return consumables[0]?.id || '';
  });
  const [bhpQty, setBhpQty] = useState(1);
  const [bhpPurpose, setBhpPurpose] = useState('');

  // Success states
  const [loanSuccessSlip, setLoanSuccessSlip] = useState<{
    borrower: string;
    itemName: string;
    qty: number;
    borrowDate: string;
    dueDate: string;
  } | null>(null);

  const [bhpSuccessSlip, setBhpSuccessSlip] = useState<{
    requestNumber: string;
    applicant: string;
    itemName: string;
    qty: number;
    unit: string;
    purpose: string;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin + window.location.pathname
    : '';
  const currentFormUrl = `${baseUrl}?form=${activeForm}`;

  const handleCopyCurrentFormUrl = () => {
    navigator.clipboard.writeText(currentFormUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const availableAssets = filterFixedAssets(items);
  const availableConsumables = filterConsumables(items);

  const selectedAsset = availableAssets.find(i => i.id === loanItemId);
  const selectedConsumable = availableConsumables.find(i => i.id === bhpItemId);

  // Submit Loan
  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedAsset) {
      setErrorMessage('Pilih barang sarpras yang ingin dipinjam.');
      return;
    }

    if (loanQty > selectedAsset.qty) {
      setErrorMessage(`Stok tidak mencukupi! Hanya tersedia ${selectedAsset.qty} ${selectedAsset.unit}.`);
      return;
    }

    onSubmitLoan({
      borrower: loanApplicant.trim(),
      role: loanRole,
      contact: loanContact.trim(),
      itemId: selectedAsset.id,
      itemCode: selectedAsset.code,
      itemName: selectedAsset.name,
      qty: loanQty,
      borrowDate: loanBorrowDate,
      dueDate: loanDueDate,
      purpose: loanPurpose.trim(),
      petugas: 'Formulir Online Mandiri'
    });

    setLoanSuccessSlip({
      borrower: loanApplicant.trim(),
      itemName: selectedAsset.name,
      qty: loanQty,
      borrowDate: loanBorrowDate,
      dueDate: loanDueDate
    });
  };

  // Submit Consumable
  const handleBhpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedConsumable) {
      setErrorMessage('Pilih barang habis pakai yang diminta.');
      return;
    }

    if (bhpQty > selectedConsumable.qty) {
      setErrorMessage(`Stok tidak mencukupi! Hanya tersedia ${selectedConsumable.qty} ${selectedConsumable.unit}.`);
      return;
    }

    const existingNumbers = existingRequests.map(r => r.requestNumber);
    const reqNum = generateRequestNumber('REQ-BHP', existingNumbers);

    onSubmitConsumableRequest({
      requestNumber: reqNum,
      applicant: bhpApplicant.trim(),
      role: bhpRole,
      unitOrClass: bhpUnitClass.trim(),
      contact: bhpContact.trim(),
      itemId: selectedConsumable.id,
      itemCode: selectedConsumable.code,
      itemName: selectedConsumable.name,
      qty: bhpQty,
      unit: selectedConsumable.unit,
      requestDate: new Date().toISOString().split('T')[0],
      purpose: bhpPurpose.trim(),
      status: 'DISETUJUI',
      petugas: 'Formulir Online Mandiri'
    });

    setBhpSuccessSlip({
      requestNumber: reqNum,
      applicant: bhpApplicant.trim(),
      itemName: selectedConsumable.name,
      qty: bhpQty,
      unit: selectedConsumable.unit,
      purpose: bhpPurpose.trim()
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-white">
      
      {/* Public Top Navbar */}
      <header className="bg-slate-900/90 border-b border-white/10 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-cyan-600 via-indigo-600 to-sky-500 p-2 rounded-xl text-white shadow-lg shadow-cyan-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base font-heading text-white">
                SARPRAS ONLINE <span className="text-cyan-400">MADTSAMU</span>
              </h1>
              <p className="text-[11px] text-slate-400">
                MTs Muhammadiyah Metro &bull; Form Layanan Mandiri
              </p>
            </div>
          </div>

          <button
            onClick={onBackToAdmin}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panel Admin</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Type Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-900/80 border border-white/10 rounded-2xl">
          <button
            onClick={() => {
              setActiveForm('pinjam');
              setLoanSuccessSlip(null);
              setErrorMessage('');
              window.history.replaceState({}, '', '?form=pinjam');
            }}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              activeForm === 'pinjam'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Box className="w-4 h-4 text-cyan-300" />
            <span>Peminjaman Barang</span>
          </button>

          <button
            onClick={() => {
              setActiveForm('habis-pakai');
              setBhpSuccessSlip(null);
              setErrorMessage('');
              window.history.replaceState({}, '', '?form=habis-pakai');
            }}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              activeForm === 'habis-pakai'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PackageOpen className="w-4 h-4 text-amber-300" />
            <span>Barang Habis Pakai</span>
          </button>
        </div>

        {/* Direct Link Share Banner for Users on the Form */}
        <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <Link2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-[11px] text-slate-400 truncate font-mono-code">
              {currentFormUrl}
            </span>
          </div>
          <button
            onClick={handleCopyCurrentFormUrl}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0 shadow-sm ${
              copiedLink 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedLink ? 'Tersalin!' : 'Salin Tautan'}</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* --- FORM 1: PEMINJAMAN BARANG SARPRAS --- */}
        {activeForm === 'pinjam' && (
          <div>
            {loanSuccessSlip ? (
              /* Success Confirmation Card */
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-5 text-center shadow-2xl">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl mx-auto flex items-center justify-center text-3xl">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-heading">
                    Permohonan Peminjaman Berhasil Dikirim!
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Silakan tunjukkan bukti ini kepada petugas Sarpras saat mengambil barang di ruangan.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/10 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Peminjam:</span>
                    <span className="font-bold text-slate-100">{loanSuccessSlip.borrower}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Barang:</span>
                    <span className="font-bold text-cyan-300">{loanSuccessSlip.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jumlah:</span>
                    <span className="font-bold text-white">{loanSuccessSlip.qty} unit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tanggal Pinjam:</span>
                    <span className="font-mono-code text-slate-200">{loanSuccessSlip.borrowDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Batas Pengembalian:</span>
                    <span className="font-mono-code text-amber-300 font-bold">{loanSuccessSlip.dueDate}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(
                        `*BUKTI PENGAJUAN PEMINJAMAN SARPRAS*\n` +
                        `MTs Muhammadiyah Metro\n\n` +
                        `Nama: ${loanSuccessSlip.borrower}\n` +
                        `Barang: ${loanSuccessSlip.itemName} (${loanSuccessSlip.qty} unit)\n` +
                        `Tgl Pinjam: ${loanSuccessSlip.borrowDate}\n` +
                        `Batas Kembali: ${loanSuccessSlip.dueDate}\n\n` +
                        `Mohon izin untuk mengambil barang di ruang Sarpras. Terima kasih.`
                      );
                      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Konfirmasi ke WhatsApp Sarpras</span>
                  </button>

                  <button
                    onClick={() => setLoanSuccessSlip(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                  >
                    Ajukan Peminjaman Lain
                  </button>
                </div>
              </div>
            ) : (
              /* Loan Input Form */
              <form onSubmit={handleLoanSubmit} className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 text-xs shadow-xl">
                <div>
                  <h2 className="text-lg font-bold text-white font-heading">
                    Formulir Peminjaman Sarpras Madrasah
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Isi data diri dan pilih sarana yang akan digunakan untuk kegiatan madrasah
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Nama Lengkap Peminjam *
                    </label>
                    <input
                      type="text"
                      required
                      value={loanApplicant}
                      onChange={(e) => setLoanApplicant(e.target.value)}
                      placeholder="Contoh: Ustadz Ahmad / M. Fikri"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Kategori / Peran *
                    </label>
                    <select
                      value={loanRole}
                      onChange={(e) => setLoanRole(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Guru">Guru / Ustadz / Ustadzah</option>
                      <option value="Siswa">Siswa / Peserta Didik</option>
                      <option value="Staf / Karyawan">Staf / Tata Usaha</option>
                      <option value="Organisasi / IPM">Organisasi IPM / Hizbul Wathan / Tapak Suci</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    No. WhatsApp Aktif / Rombel Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    value={loanContact}
                    onChange={(e) => setLoanContact(e.target.value)}
                    placeholder="Contoh: 0812-3456-7890 (Kelas IX B / Guru IPA)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Pilih Barang yang Dipinjam *
                  </label>
                  <select
                    value={loanItemId}
                    onChange={(e) => setLoanItemId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {availableAssets.map((asset) => (
                      <option key={asset.id} value={asset.id} disabled={asset.qty <= 0}>
                        {asset.code} - {asset.name} (Tersedia: {asset.qty} {asset.unit}) {asset.qty <= 0 ? '[STOK HABIS]' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Jumlah Unit *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedAsset?.qty || 99}
                      required
                      value={loanQty}
                      onChange={(e) => setLoanQty(parseInt(e.target.value) || 1)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white font-bold text-center focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Tgl Pinjam *
                    </label>
                    <input
                      type="date"
                      required
                      value={loanBorrowDate}
                      onChange={(e) => setLoanBorrowDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white font-mono-code focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Batas Kembali *
                    </label>
                    <input
                      type="date"
                      required
                      value={loanDueDate}
                      onChange={(e) => setLoanDueDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white font-mono-code focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Keperluan / Mata Pelajaran / Kegiatan *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    placeholder="Contoh: Pembelajaran Fiqih di Smart Class & Presentasi Hasil Praktikum"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm transition shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Permohonan Peminjaman</span>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    Dengan mengajukan, peminjam bertanggung jawab menjaga keutuhan dan kelengkapan barang.
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

        {/* --- FORM 2: PERMINTAAN BARANG HABIS PAKAI (BHP) --- */}
        {activeForm === 'habis-pakai' && (
          <div>
            {bhpSuccessSlip ? (
              /* BHP Confirmation Slip */
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-5 text-center shadow-2xl">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center text-3xl">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {bhpSuccessSlip.requestNumber}
                  </span>
                  <h2 className="text-xl font-bold text-white font-heading mt-2">
                    Permintaan Barang Habis Pakai Disetujui!
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Stok telah dialokasikan. Silakan mengambil barang di ruang Sarpras / Tata Usaha.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/10 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nomor Registrasi:</span>
                    <span className="font-mono-code font-bold text-amber-300">{bhpSuccessSlip.requestNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pemohon / Penerima:</span>
                    <span className="font-bold text-slate-100">{bhpSuccessSlip.applicant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Barang Habis Pakai:</span>
                    <span className="font-bold text-cyan-300">{bhpSuccessSlip.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jumlah Diserahkan:</span>
                    <span className="font-bold text-white">{bhpSuccessSlip.qty} {bhpSuccessSlip.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Keperluan:</span>
                    <span className="text-slate-300">{bhpSuccessSlip.purpose}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/10 text-[11px]">
                    <span className="text-slate-400">Status:</span>
                    <span className="font-bold text-emerald-400">DISETUJUI / SELESAI</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(
                        `*BUKTI PENGAMBILAN BARANG HABIS PAKAI (BHP)*\n` +
                        `MTs Muhammadiyah Metro\n` +
                        `No: ${bhpSuccessSlip.requestNumber}\n\n` +
                        `Pemohon: ${bhpSuccessSlip.applicant}\n` +
                        `Barang: ${bhpSuccessSlip.itemName} (${bhpSuccessSlip.qty} ${bhpSuccessSlip.unit})\n` +
                        `Keperluan: ${bhpSuccessSlip.purpose}\n\n` +
                        `Terima kasih telah mengajukan melalui portal sarpras digital.`
                      );
                      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Kirim Bukti ke WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setBhpSuccessSlip(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                  >
                    Minta Barang Habis Pakai Lain
                  </button>
                </div>
              </div>
            ) : (
              /* BHP Input Form */
              <form onSubmit={handleBhpSubmit} className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 text-xs shadow-xl">
                <div>
                  <h2 className="text-lg font-bold text-white font-heading">
                    Formulir Permintaan Barang Habis Pakai (BHP / ATK)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Permintaan kertas, spidol, baterai, tinta printer, atau ATK untuk operasional madrasah (tidak perlu dikembalikan)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Nama Pemohon / Penerima *
                    </label>
                    <input
                      type="text"
                      required
                      value={bhpApplicant}
                      onChange={(e) => setBhpApplicant(e.target.value)}
                      placeholder="Contoh: Ustadzah Siti Fatimah"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Kategori / Peran *
                    </label>
                    <select
                      value={bhpRole}
                      onChange={(e) => setBhpRole(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Guru">Guru Mata Pelajaran</option>
                      <option value="Staf / Karyawan">Staf Tata Usaha / Kepegawaian</option>
                      <option value="Siswa">Siswa / Panitia Kegiatan</option>
                      <option value="Organisasi / IPM">Organisasi IPM / Ekstrakurikuler</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Unit Kerja / Mata Pelajaran / Kelas *
                    </label>
                    <input
                      type="text"
                      required
                      value={bhpUnitClass}
                      onChange={(e) => setBhpUnitClass(e.target.value)}
                      placeholder="Contoh: Guru Matematika / Panitia Ujian"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      No. WhatsApp Pemohon *
                    </label>
                    <input
                      type="text"
                      required
                      value={bhpContact}
                      onChange={(e) => setBhpContact(e.target.value)}
                      placeholder="Contoh: 0813-9876-5432"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Pilih Barang Habis Pakai (BHP) *
                  </label>
                  <select
                    value={bhpItemId}
                    onChange={(e) => setBhpItemId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  >
                    {availableConsumables.map((item) => (
                      <option key={item.id} value={item.id} disabled={item.qty <= 0}>
                        {item.code} - {item.name} (Tersedia: {item.qty} {item.unit}) {item.qty <= 0 ? '[HABIS]' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Jumlah Diminta ({selectedConsumable?.unit || 'unit'}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedConsumable?.qty || 99}
                    required
                    value={bhpQty}
                    onChange={(e) => setBhpQty(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white font-bold text-center focus:border-amber-400 focus:outline-none"
                  />
                  {selectedConsumable && (
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Maksimal pengambilan sesuai stok tersedia: {selectedConsumable.qty} {selectedConsumable.unit}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Tujuan Penggunaan / Alokasi Kegiatan *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={bhpPurpose}
                    onChange={(e) => setBhpPurpose(e.target.value)}
                    placeholder="Contoh: Penggandaan soal Asesmen Sumatif Akhir Semester kelas VII & VIII"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-amber-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-sm transition shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Ajukan Permintaan Barang Habis Pakai</span>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    Pengambilan barang habis pakai dicatat dalam Laporan Pertanggungjawaban Realisasi Sarpras BOS.
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-white/5 py-4 text-xs text-slate-500 text-center">
        &copy; MTs Muhammadiyah Metro &bull; Sistem Layanan Sarpras Mandiri Terpadu
      </footer>

    </div>
  );
};
