import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Link2, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Printer, 
  Download, 
  Box, 
  PackageOpen, 
  QrCode, 
  Sparkles, 
  PhoneCall, 
  MessageSquare, 
  Smartphone, 
  Laptop,
  CheckCircle2,
  FileText,
  AlertCircle,
  Eye
} from 'lucide-react';
import type { InventoryItem } from '../types/inventory.ts';
import { filterFixedAssets, filterConsumables } from '../utils/inventoryLogic.ts';

interface PortalLinksViewProps {
  items: InventoryItem[];
  onOpenPublicForm: (type: 'pinjam' | 'habis-pakai') => void;
  onAddToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const PortalLinksView: React.FC<PortalLinksViewProps> = ({
  items,
  onOpenPublicForm,
  onAddToast
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [loanQrDataUrl, setLoanQrDataUrl] = useState<string>('');
  const [bhpQrDataUrl, setBhpQrDataUrl] = useState<string>('');
  const [selectedTargetAudience, setSelectedTargetAudience] = useState<'guru' | 'siswa' | 'staf'>('guru');
  const [previewFormType, setPreviewFormType] = useState<'pinjam' | 'habis-pakai'>('pinjam');

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin + window.location.pathname 
    : 'https://sarpras-madtsamu.web.app';
  
  const loanUrl = `${baseUrl}?form=pinjam`;
  const consumableUrl = `${baseUrl}?form=habis-pakai`;

  const assetItems = filterFixedAssets(items);
  const consumableItems = filterConsumables(items);

  // Generate real scannable QR codes
  useEffect(() => {
    QRCode.toDataURL(loanUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    }).then(url => setLoanQrDataUrl(url)).catch(console.error);

    QRCode.toDataURL(consumableUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    }).then(url => setBhpQrDataUrl(url)).catch(console.error);
  }, [loanUrl, consumableUrl]);

  const handleCopy = (url: string, type: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedType(type);
    onAddToast(`Tautan ${label} berhasil disalin ke papan klip!`, 'success');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadQr = (dataUrl: string, filename: string) => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onAddToast(`QR Code ${filename} berhasil diunduh`, 'success');
  };

  const getWaMessage = (type: 'pinjam' | 'habis-pakai' | 'both', audience: 'guru' | 'siswa' | 'staf') => {
    let salam = "Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\n";
    if (audience === 'guru') {
      salam += "Bapak/Ibu Dewan Guru MTs Muhammadiyah Metro yang kami hormati,\n\n";
    } else if (audience === 'siswa') {
      salam += "Teman-teman Siswa/Siswi dan Pengurus IPM MTs Muhammadiyah Metro,\n\n";
    } else {
      salam += "Bapak/Ibu Staf Tenaga Kependidikan & Karyawan MTs Muhammadiyah Metro,\n\n";
    }

    if (type === 'pinjam') {
      return salam + 
        `Untuk mempermudah layanan peminjaman sarana dan fasilitas madrasah (LCD Proyektor, Sound System, Laptop/Chromebook, Mikroskop, Alat Olahraga, dll.), silakan mengajukan melalui formulir online resmi:\n\n` +
        `🔗 *Formulir Peminjaman Barang:*\n👉 ${loanUrl}\n\n` +
        `_Mohon mengisi formulir sebelum mengambil barang di ruang Sarpras._\n\n` +
        `Wassalamu'alaikum Wr. Wb.\n*Pengelola Sarpras MTs Muhammadiyah Metro*`;
    } else if (type === 'habis-pakai') {
      return salam + 
        `Untuk pengajuan kebutuhan Alat Tulis Kantor (ATK) dan Barang Habis Pakai (Kertas HVS, Spidol Whiteboard, Tinta Printer, Baterai Mic, dll.), silakan mengisi formulir resmi:\n\n` +
        `🔗 *Formulir Permintaan Barang Habis Pakai (BHP):*\n👉 ${consumableUrl}\n\n` +
        `_Permintaan akan segera disiapkan oleh petugas Sarpras._\n\n` +
        `Wassalamu'alaikum Wr. Wb.\n*Pengelola Sarpras MTs Muhammadiyah Metro*`;
    } else {
      return salam + 
        `Kini layanan sarana & prasarana MTs Muhammadiyah Metro telah berbasis online. Silakan akses link di bawah ini sesuai kebutuhan:\n\n` +
        `1️⃣ *Peminjaman Barang & Alat Sarpras:*\n👉 ${loanUrl}\n_(Proyektor, Sound, Laptop, Tenda, dll.)_\n\n` +
        `2️⃣ *Permintaan Barang Habis Pakai (BHP/ATK):*\n👉 ${consumableUrl}\n_(Kertas HVS, Spidol, Tinta, Baterai, dll.)_\n\n` +
        `Wassalamu'alaikum Wr. Wb.\n*Pengelola Sarpras MTs Muhammadiyah Metro*`;
    }
  };

  const handleShareWhatsApp = (type: 'pinjam' | 'habis-pakai' | 'both') => {
    const text = encodeURIComponent(getWaMessage(type, selectedTargetAudience));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900/60 via-slate-900 to-indigo-950/70 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pusat Layanan Formulir Publik Online</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-tight">
              Tautan Formulir Peminjaman & Habis Pakai
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Bagikan tautan langsung atau cetak poster kode QR di bawah ini agar Guru, Siswa, dan Tenaga Kependidikan dapat mengajukan peminjaman fasilitas madrasah maupun pengambilan ATK secara mandiri melalui smartphone.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handlePrintPoster}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Poster QR (A4)</span>
            </button>
            <button
              onClick={() => handleShareWhatsApp('both')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 border border-emerald-400/30"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim Kedua Link via WA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two High-Impact Cards: Link Peminjaman vs Link Habis Pakai */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: FORMULIR PEMINJAMAN BARANG (ASET TETAP) */}
        <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-cyan-400 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-4">
            {/* Title & Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-inner">
                  <Box className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 font-mono-code uppercase">LINK #1</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Wajib Dikembalikan
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-heading mt-0.5">
                    Peminjaman Barang & Peralatan
                  </h2>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tautan khusus untuk meminjam sarana modal dan fasilitas kegiatan: LCD Proyektor, Sound System, Chromebook, Laptop, Mikroskop Lab, Kabel Rol, Bola & Alat Olahraga, dll.
            </p>

            {/* Live QR Code and Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-white/10 items-center">
              <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl shadow-md sm:col-span-1">
                {loanQrDataUrl ? (
                  <img 
                    src={loanQrDataUrl} 
                    alt="QR Code Peminjaman Barang" 
                    className="w-28 h-28 object-contain"
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center text-slate-400 text-xs">
                    Membuat QR...
                  </div>
                )}
                <span className="text-[10px] font-bold text-slate-800 mt-1 uppercase tracking-tight">Scan via Kamera</span>
              </div>

              <div className="sm:col-span-2 space-y-2 text-xs">
                <div className="text-slate-300">
                  <span className="font-semibold text-white">Barang Tersedia: </span>
                  <span className="text-cyan-400 font-bold">{assetItems.length} jenis</span> sarana aktif
                </div>
                <div className="text-[11px] text-slate-400">
                  Sistem otomatis mencatat peminjam, kelas/bagian, kontak WhatsApp, dan tanggal tenggat pengembalian.
                </div>
                <button
                  onClick={() => handleDownloadQr(loanQrDataUrl, 'qrcode-peminjaman-sarpras-madtsamu.png')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-[11px] font-medium flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Gambar QR</span>
                </button>
              </div>
            </div>

            {/* Direct URL Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tautan Langsung Formulir Peminjaman:</span>
              </label>
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-cyan-500/30 font-mono-code text-xs">
                <input
                  type="text"
                  readOnly
                  value={loanUrl}
                  className="bg-transparent text-cyan-200 flex-1 outline-none text-xs truncate select-all cursor-text"
                />
                <button
                  onClick={() => handleCopy(loanUrl, 'pinjam', 'Formulir Peminjaman Barang')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 text-xs shadow-md ${
                    copiedType === 'pinjam'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30'
                  }`}
                >
                  {copiedType === 'pinjam' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'pinjam' ? 'Tersalin!' : 'Salin Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenPublicForm('pinjam')}
              className="flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Buka Form Online</span>
            </button>
            <button
              onClick={() => handleShareWhatsApp('pinjam')}
              className="flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kirim via WhatsApp</span>
            </button>
          </div>

        </div>

        {/* CARD 2: FORMULIR PERMINTAAN / PEMINJAMAN BARANG HABIS PAKAI (BHP/ATK) */}
        <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-400 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-4">
            {/* Title & Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-inner">
                  <PackageOpen className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 font-mono-code uppercase">LINK #2</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Habis Pakai (BHP / ATK)
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-heading mt-0.5">
                    Permintaan Barang Habis Pakai
                  </h2>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tautan khusus pengajuan ATK & bahan habis pakai: Kertas HVS A4/F4, Spidol Whiteboard Snowman, Tinta Refill, Baterai Mic Wireless, Tinta Printer Epson, Map Snelhecter, Buku Administrasi, dll.
            </p>

            {/* Live QR Code and Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-white/10 items-center">
              <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl shadow-md sm:col-span-1">
                {bhpQrDataUrl ? (
                  <img 
                    src={bhpQrDataUrl} 
                    alt="QR Code Barang Habis Pakai" 
                    className="w-28 h-28 object-contain"
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center text-slate-400 text-xs">
                    Membuat QR...
                  </div>
                )}
                <span className="text-[10px] font-bold text-slate-800 mt-1 uppercase tracking-tight">Scan via Kamera</span>
              </div>

              <div className="sm:col-span-2 space-y-2 text-xs">
                <div className="text-slate-300">
                  <span className="font-semibold text-white">Item BHP Tersedia: </span>
                  <span className="text-amber-400 font-bold">{consumableItems.length} jenis</span> komoditas ATK
                </div>
                <div className="text-[11px] text-slate-400">
                  Tidak perlu dikembalikan. Pengajuan langsung terdata dalam riwayat pemakaian & laporan audit madrasah.
                </div>
                <button
                  onClick={() => handleDownloadQr(bhpQrDataUrl, 'qrcode-bhp-sarpras-madtsamu.png')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-[11px] font-medium flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Gambar QR</span>
                </button>
              </div>
            </div>

            {/* Direct URL Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Tautan Langsung Formulir Habis Pakai:</span>
              </label>
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-amber-500/30 font-mono-code text-xs">
                <input
                  type="text"
                  readOnly
                  value={consumableUrl}
                  className="bg-transparent text-amber-200 flex-1 outline-none text-xs truncate select-all cursor-text"
                />
                <button
                  onClick={() => handleCopy(consumableUrl, 'habis-pakai', 'Formulir Barang Habis Pakai')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 text-xs shadow-md ${
                    copiedType === 'habis-pakai'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  }`}
                >
                  {copiedType === 'habis-pakai' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'habis-pakai' ? 'Tersalin!' : 'Salin Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenPublicForm('habis-pakai')}
              className="flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-200 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Buka Form Online</span>
            </button>
            <button
              onClick={() => handleShareWhatsApp('habis-pakai')}
              className="flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kirim via WhatsApp</span>
            </button>
          </div>

        </div>

      </div>

      {/* Target Audience & WhatsApp Message Generator */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>Generator Pesan WhatsApp Siap Kirim</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pilih kelompok sasaran untuk mendapatkan kalimat pengumuman yang ramah dan sopan untuk grup WhatsApp madrasah.
            </p>
          </div>

          {/* Audience Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-white/10">
            <button
              onClick={() => setSelectedTargetAudience('guru')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedTargetAudience === 'guru'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grup Guru
            </button>
            <button
              onClick={() => setSelectedTargetAudience('siswa')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedTargetAudience === 'siswa'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Siswa / IPM
            </button>
            <button
              onClick={() => setSelectedTargetAudience('staf')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedTargetAudience === 'staf'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Staf TU & Karyawan
            </button>
          </div>
        </div>

        {/* Generated Message Preview Box */}
        <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 relative">
          <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
            {getWaMessage('both', selectedTargetAudience)}
          </pre>
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Teks ini memuat kedua tautan formulir secara lengkap dan rapi.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getWaMessage('both', selectedTargetAudience));
                  onAddToast('Pesan WhatsApp berhasil disalin ke papan klip!', 'success');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 border border-white/10"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Salin Teks Pesan</span>
              </button>
              <button
                onClick={() => handleShareWhatsApp('both')}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Kirim ke WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Poster Template (Hidden on screen, rendered on Print) */}
      <div className="hidden print:block bg-white text-black p-8 font-sans">
        <div className="text-center border-b-4 border-emerald-800 pb-4 mb-6">
          <p className="text-xs uppercase tracking-widest text-slate-600 font-bold">PIMPINAN DAERAH MUHAMMADIYAH KOTA METRO</p>
          <p className="text-xs uppercase tracking-widest text-slate-600 font-bold">MAJELIS PENDIDIKAN DASAR DAN MENENGAH</p>
          <h1 className="text-2xl font-black uppercase text-slate-900 mt-1">
            MADRASAH TSANAWIYAH MUHAMMADIYAH METRO
          </h1>
          <p className="text-sm font-bold text-emerald-800">
            UNIT PENGELOLA SARANA DAN PRASARANA (SARPRAS DIGITAL)
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Jl. KH. Ahmad Dahlan No. 1 Kota Metro, Lampung &bull; NPSN: 10816912 &bull; Terakreditasi A
          </p>
        </div>

        <div className="text-center my-6">
          <h2 className="text-xl font-black uppercase tracking-tight bg-slate-100 py-2 rounded-lg border border-slate-300">
            PENGUMUMAN LAYANAN SARPRAS ONLINE
          </h2>
          <p className="text-xs text-slate-700 mt-2">
            Silakan scan kode QR di bawah menggunakan kamera HP untuk mengajukan peminjaman atau permintaan barang secara langsung.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 my-8 text-center">
          {/* Poster Box 1: Peminjaman */}
          <div className="p-6 border-2 border-slate-900 rounded-3xl flex flex-col items-center bg-slate-50/50">
            <span className="text-xs font-bold px-3 py-1 bg-slate-900 text-white rounded-full uppercase mb-4">
              1. PEMINJAMAN SARANA / ALAT
            </span>
            {loanQrDataUrl && (
              <img 
                src={loanQrDataUrl} 
                alt="QR Peminjaman" 
                className="w-48 h-48 border-2 border-slate-800 p-2 bg-white rounded-2xl shadow-sm"
              />
            )}
            <h3 className="font-black text-sm uppercase mt-4 text-slate-900">
              Proyektor, Laptop, Sound, Lab IPA, Olahraga
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Wajib dikembalikan setelah kegiatan selesai sesuai batas waktu.
            </p>
            <p className="text-[10px] font-mono mt-3 bg-white px-2 py-1 rounded border border-slate-300 break-all">
              {loanUrl}
            </p>
          </div>

          {/* Poster Box 2: Habis Pakai */}
          <div className="p-6 border-2 border-slate-900 rounded-3xl flex flex-col items-center bg-slate-50/50">
            <span className="text-xs font-bold px-3 py-1 bg-slate-900 text-white rounded-full uppercase mb-4">
              2. BARANG HABIS PAKAI (BHP)
            </span>
            {bhpQrDataUrl && (
              <img 
                src={bhpQrDataUrl} 
                alt="QR Habis Pakai" 
                className="w-48 h-48 border-2 border-slate-800 p-2 bg-white rounded-2xl shadow-sm"
              />
            )}
            <h3 className="font-black text-sm uppercase mt-4 text-slate-900">
              Kertas HVS, Spidol Whiteboard, Tinta, Baterai
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Barang habis pakai (tidak dikembalikan). Tercatat untuk audit ATK.
            </p>
            <p className="text-[10px] font-mono mt-3 bg-white px-2 py-1 rounded border border-slate-300 break-all">
              {consumableUrl}
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 border border-slate-300 rounded-2xl text-xs text-slate-700 bg-slate-50 space-y-1">
          <p className="font-bold">Langkah Penggunaan Layanan Online:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
            <li>Arahkan kamera smartphone ke kode QR sesuai kebutuhan (Peminjaman atau Habis Pakai).</li>
            <li>Isi nama pemohon, bagian/kelas, nomor WhatsApp, nama barang, dan keperluan kegiatan.</li>
            <li>Tunjukkan bukti pengajuan di layar HP kepada staf Sarpras saat mengambil barang di ruang inventaris.</li>
          </ol>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 mt-10 border-t pt-4">
          <span>Dicetak otomatis dari Sistem SARPRAS MADTSAMU</span>
          <span>Metro, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

    </div>
  );
};
