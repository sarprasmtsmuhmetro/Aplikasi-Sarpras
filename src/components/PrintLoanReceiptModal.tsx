import React from 'react';
import type { LoanRecord } from '../types/inventory.ts';
import { X, Printer } from 'lucide-react';

interface PrintLoanReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanRecord | null;
}

export const PrintLoanReceiptModal: React.FC<PrintLoanReceiptModalProps> = ({
  isOpen,
  onClose,
  loan
}) => {
  if (!isOpen || !loan) return null;

  const handlePrint = () => {
    window.print();
  };

  const cleanId = loan.id.replace('loan-', '').slice(-4);
  const receiptNumber = `BA-PINJAM/${new Date().getFullYear()}/${cleanId}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-fade-in text-slate-100">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-cyan-200" />
            <h3 className="font-bold text-base font-heading">
              Surat Bukti Peminjaman Sarana & Prasarana
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Berita Acara</span>
            </button>
            <button
              onClick={onClose}
              className="text-cyan-200 hover:text-white transition p-1"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Preview */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 max-w-2xl mx-auto text-xs leading-relaxed font-serif">
            
            {/* School Letterhead / Kop Surat */}
            <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-700">
                PIMPINAN DAERAH MUHAMMADIYAH KOTA METRO
              </h4>
              <h2 className="text-base font-bold tracking-tight uppercase font-sans text-slate-900">
                MADRASAH TSANAWIYAH MUHAMMADIYAH METRO
              </h2>
              <p className="text-[10px] text-slate-600 font-sans">
                Status: Terakreditasi A &bull; Madrasah Unggul Center of Excellence
              </p>
              <p className="text-[9px] text-slate-500 font-sans mt-0.5">
                Jl. KH. Ahmad Dahlan No. 1, Ganjarasri, Kota Metro, Lampung 34125 &bull; Telp. (0725) 41234
              </p>
            </div>

            {/* Document Title */}
            <div className="text-center mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider underline font-sans">
                SURAT TANDA TERIMA PEMINJAMAN SARPRAS
              </h3>
              <p className="text-[10px] font-mono mt-0.5 text-slate-600">
                Nomor: {receiptNumber}
              </p>
            </div>

            <p className="mb-3 text-[11px]">
              Pada hari ini yang bertanda tangan di bawah ini menerangkan bahwa telah diserahkan sarana dan prasarana madrasah kepada peminjam dengan rincian sebagai berikut:
            </p>

            {/* Borrower Details Table */}
            <table className="w-full mb-4 text-[11px]">
              <tbody>
                <tr>
                  <td className="w-36 py-1 font-semibold text-slate-700">Nama Peminjam</td>
                  <td className="py-1">: <span className="font-bold text-slate-900">{loan.borrower}</span></td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">Peran / Instansi</td>
                  <td className="py-1">: {loan.role}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">Kontak / Kelas</td>
                  <td className="py-1">: {loan.contact}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">Keperluan</td>
                  <td className="py-1">: {loan.purpose}</td>
                </tr>
              </tbody>
            </table>

            {/* Item List Table */}
            <div className="border border-slate-900 mb-4 overflow-hidden rounded">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 border-b border-slate-900 font-bold font-sans">
                  <tr>
                    <th className="p-2 border-r border-slate-900 w-8 text-center">No</th>
                    <th className="p-2 border-r border-slate-900">Kode Barang</th>
                    <th className="p-2 border-r border-slate-900">Nama Sarana / Prasarana</th>
                    <th className="p-2 border-r border-slate-900 text-center w-16">Jumlah</th>
                    <th className="p-2 text-center w-28">Kondisi Awal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-r border-slate-900 text-center">1</td>
                    <td className="p-2 border-r border-slate-900 font-mono text-[10px]">{loan.itemCode}</td>
                    <td className="p-2 border-r border-slate-900 font-semibold">{loan.itemName}</td>
                    <td className="p-2 border-r border-slate-900 text-center font-bold">{loan.qty} unit</td>
                    <td className="p-2 text-center font-semibold text-emerald-700">Baik / Lengkap</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Schedule & Conditions */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 mb-6 text-[10px] space-y-1">
              <div className="flex justify-between">
                <span>Tanggal Peminjaman: <strong className="font-mono">{loan.borrowDate}</strong></span>
                <span>Batas Waktu Pengembalian: <strong className="font-mono text-rose-700">{loan.dueDate}</strong></span>
              </div>
              <p className="text-slate-600 italic pt-1 border-t border-slate-200">
                Catatan: Peminjam bertanggung jawab penuh atas keutuhan dan kelengkapan barang. Apabila terjadi kehilangan atau kerusakan akibat kelalaian, peminjam bersedia mengganti sesuai ketentuan madrasah.
              </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 text-center text-[11px] pt-4 font-sans">
              <div>
                <p className="text-slate-600 mb-14">Peminjam / Pemohon,</p>
                <p className="font-bold underline text-slate-900">{loan.borrower}</p>
                <p className="text-[10px] text-slate-500">{loan.role}</p>
              </div>

              <div>
                <p className="text-slate-600 mb-14">Petugas Pengelola Sarpras,</p>
                <p className="font-bold underline text-slate-900">{loan.petugas}</p>
                <p className="text-[10px] text-slate-500">MTs Muhammadiyah Metro</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
