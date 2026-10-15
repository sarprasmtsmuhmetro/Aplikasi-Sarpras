import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Link2, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Printer, 
  Box, 
  PackageOpen, 
  Building2, 
  QrCode,
  Download
} from 'lucide-react';

interface ShareLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPublicForm: (type: 'pinjam' | 'habis-pakai') => void;
}

export const ShareLinksModal: React.FC<ShareLinksModalProps> = ({
  isOpen,
  onClose,
  onOpenPublicForm
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [loanQrDataUrl, setLoanQrDataUrl] = useState<string>('');
  const [bhpQrDataUrl, setBhpQrDataUrl] = useState<string>('');

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin + window.location.pathname 
    : '';
  const loanUrl = `${baseUrl}?form=pinjam`;
  const consumableUrl = `${baseUrl}?form=habis-pakai`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(loanUrl, {
        width: 280,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' }
      }).then(url => setLoanQrDataUrl(url)).catch(console.error);

      QRCode.toDataURL(consumableUrl, {
        width: 280,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' }
      }).then(url => setBhpQrDataUrl(url)).catch(console.error);
    }
  }, [isOpen, loanUrl, consumableUrl]);

  if (!isOpen) return null;

  const handleCopy = (url: string, type: string) => {
    navigator.clipboard.writeText(url);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleShareWhatsApp = (title: string, url: string, description: string) => {
    const message = encodeURIComponent(
      `*LAYANAN ONLINE SARPRAS MTS MUHAMMADIYAH METRO*\n\n` +
      `Assalamu'alaikum Wr. Wb.\n` +
      `Bapak/Ibu Dewan Guru, Staf, dan Siswa dapat mengakses formulir online *${title}* melalui tautan berikut:\n\n` +
      `👉 ${url}\n\n` +
      `_Catatan: ${description}_\n` +
      `Mohon mengisi formulir sebelum mengambil barang di ruang Sarpras. Terima kasih.\n\n` +
      `Wassalamu'alaikum Wr. Wb.\n*Pengelola Sarpras MTs Muhammadiyah Metro*`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleDownloadQr = (dataUrl: string, filename: string) => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-fade-in text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-600 via-indigo-600 to-sky-600 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <Link2 className="w-5 h-5 text-cyan-200" />
            <div>
              <h3 className="font-bold text-base font-heading">
                Link Formulir Online Madrasah
              </h3>
              <p className="text-[11px] text-cyan-200/80">
                Bagikan link ini kepada guru, staf, atau siswa via WhatsApp & Grup Madrasah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-cyan-200 hover:text-white transition p-1"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Card 1: Peminjaman Barang */}
          <div className="bg-slate-800/80 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    1. Link Formulir Peminjaman Barang Sarpras
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Untuk proyektor, laptop, speaker wireless, mikroskop, kabel rol, bola, alat olahraga, tenda, dll.
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                Wajib Kembali
              </span>
            </div>

            {/* URL Input Box */}
            <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-white/10 font-mono-code text-[11px]">
              <span className="text-slate-400 truncate flex-1 pl-1">
                {loanUrl}
              </span>
              <button
                onClick={() => handleCopy(loanUrl, 'pinjam')}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center gap-1 shrink-0"
              >
                {copiedType === 'pinjam' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'pinjam' ? 'Tersalin!' : 'Salin Link'}</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenPublicForm('pinjam');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition flex items-center gap-1.5 font-semibold text-[11px]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Buka Formulir</span>
              </button>
              <button
                onClick={() => handleShareWhatsApp('Peminjaman Sarana Prasarana', loanUrl, 'Peminjaman proyektor, laptop, sound, dll. Wajib dikembalikan.')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1.5 font-semibold text-[11px]"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kirim via WhatsApp</span>
              </button>
              {loanQrDataUrl && (
                <button
                  onClick={() => handleDownloadQr(loanQrDataUrl, 'qrcode-peminjaman-sarpras.png')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition flex items-center gap-1.5 font-medium text-[11px]"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download QR</span>
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Permintaan Barang Habis Pakai (BHP) */}
          <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <PackageOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    2. Link Formulir Permintaan Barang Habis Pakai (BHP)
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Untuk ATK, kertas HVS A4/F4, spidol whiteboard, baterai mic, tinta printer, map snelhecter, dll.
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                Habis Pakai (Tidak Dikembalikan)
              </span>
            </div>

            {/* URL Input Box */}
            <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-white/10 font-mono-code text-[11px]">
              <span className="text-slate-400 truncate flex-1 pl-1">
                {consumableUrl}
              </span>
              <button
                onClick={() => handleCopy(consumableUrl, 'habis-pakai')}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition flex items-center gap-1 shrink-0"
              >
                {copiedType === 'habis-pakai' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'habis-pakai' ? 'Tersalin!' : 'Salin Link'}</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenPublicForm('habis-pakai');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition flex items-center gap-1.5 font-semibold text-[11px]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Buka Formulir</span>
              </button>
              <button
                onClick={() => handleShareWhatsApp('Permintaan Barang Habis Pakai (BHP/ATK)', consumableUrl, 'Pengajuan ATK seperti kertas, spidol, baterai, tinta printer.')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1.5 font-semibold text-[11px]"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kirim via WhatsApp</span>
              </button>
              {bhpQrDataUrl && (
                <button
                  onClick={() => handleDownloadQr(bhpQrDataUrl, 'qrcode-habis-pakai-sarpras.png')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition flex items-center gap-1.5 font-medium text-[11px]"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download QR</span>
                </button>
              )}
            </div>
          </div>

          {/* Printable Poster Banner */}
          <div className="p-4 bg-gradient-to-r from-slate-950 to-slate-900 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-white text-xs font-heading">
                  Cetak Poster QR Code Pengumuman Madrasah
                </h5>
                <p className="text-[11px] text-slate-400">
                  Tempel poster QR di ruang guru, mading, atau pintu kantor Sarpras
                </p>
              </div>
            </div>

            <button
              onClick={handlePrintPoster}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/30"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Poster QR</span>
            </button>
          </div>

          {/* Hidden Print Only Poster Template */}
          <div className="hidden print:block bg-white text-black p-8 font-sans">
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
              <h2 className="text-xl font-black uppercase">MADRASAH TSANAWIYAH MUHAMMADIYAH METRO</h2>
              <p className="text-sm font-bold text-slate-700">PUSAT LAYANAN SARANA & PRASARANA DIGITAL</p>
              <p className="text-xs text-slate-500">Jl. KH. Ahmad Dahlan No. 1 Metro &bull; Terakreditasi A</p>
            </div>

            <div className="text-center my-6">
              <h1 className="text-2xl font-black uppercase mb-1">SCAN UNTUK LAYANAN SARPRAS ONLINE</h1>
              <p className="text-sm text-slate-600">Silakan scan kode QR di bawah untuk mengajukan permohonan</p>
            </div>

            <div className="grid grid-cols-2 gap-8 my-8 text-center">
              <div className="p-6 border-2 border-slate-900 rounded-2xl flex flex-col items-center">
                {loanQrDataUrl ? (
                  <img src={loanQrDataUrl} alt="QR Peminjaman" className="w-40 h-40 p-1 border rounded-lg" />
                ) : (
                  <div className="w-40 h-40 bg-slate-900 text-white flex items-center justify-center font-black rounded-xl text-center p-3 text-xs">
                    FORM PEMINJAMAN SARPRAS
                  </div>
                )}
                <h3 className="font-black text-sm uppercase mt-4">1. PEMINJAMAN ALAT & ASET</h3>
                <p className="text-xs text-slate-600 mt-1">Proyektor, Laptop, Sound System, Mikroskop, dll.</p>
                <p className="text-[10px] font-mono mt-2 bg-slate-100 p-1 rounded border">{loanUrl}</p>
              </div>

              <div className="p-6 border-2 border-slate-900 rounded-2xl flex flex-col items-center">
                {bhpQrDataUrl ? (
                  <img src={bhpQrDataUrl} alt="QR Habis Pakai" className="w-40 h-40 p-1 border rounded-lg" />
                ) : (
                  <div className="w-40 h-40 bg-slate-900 text-white flex items-center justify-center font-black rounded-xl text-center p-3 text-xs">
                    FORM BARANG HABIS PAKAI
                  </div>
                )}
                <h3 className="font-black text-sm uppercase mt-4">2. BARANG HABIS PAKAI (BHP)</h3>
                <p className="text-xs text-slate-600 mt-1">Kertas HVS, Spidol, Baterai Mic, Tinta Printer, dll.</p>
                <p className="text-[10px] font-mono mt-2 bg-slate-100 p-1 rounded border">{consumableUrl}</p>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 mt-12 border-t pt-4">
              Pengelola Sarana & Prasarana MTs Muhammadiyah Metro &bull; Center of Excellence School
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
