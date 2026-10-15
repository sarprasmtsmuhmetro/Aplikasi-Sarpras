import React from 'react';
import type { ConsumableRequest } from '../types/inventory.ts';
import { X, Printer } from 'lucide-react';

interface PrintConsumableReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ConsumableRequest | null;
}

export const PrintConsumableReceiptModal: React.FC<PrintConsumableReceiptModalProps> = ({
  isOpen,
  onClose,
  request
}) => {
  if (!isOpen || !request) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-fade-in text-slate-100">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 to-rose-600 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-base font-heading">
              Bukti Pengeluaran Barang Habis Pakai (BHP)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Berkas</span>
            </button>
            <button
              onClick={onClose}
              className="text-amber-200 hover:text-white transition p-1"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Preview */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 max-w-xl mx-auto text-xs leading-relaxed font-serif">
            
            {/* Kop Madrasah */}
            <div className="text-center border-b-2 border-slate-900 pb-3 mb-4 font-sans">
              <h4 className="text-[11px] font-semibold tracking-wider uppercase text-slate-700">
                PIMPINAN DAERAH MUHAMMADIYAH KOTA METRO
              </h4>
              <h2 className="text-sm font-bold tracking-tight uppercase text-slate-900">
                MADRASAH TSANAWIYAH MUHAMMADIYAH METRO
              </h2>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Jl. KH. Ahmad Dahlan No. 1, Ganjarasri, Kota Metro, Lampung &bull; Telp. (0725) 41234
              </p>
            </div>

            {/* Title */}
            <div className="text-center mb-4 font-sans">
              <h3 className="text-xs font-bold uppercase tracking-wider underline">
                SURAT BUKTI PENGELUARAN BARANG HABIS PAKAI (BHP)
              </h3>
              <p className="text-[10px] font-mono mt-0.5 text-slate-600">
                Nomor: {request.requestNumber}
              </p>
            </div>

            <p className="mb-3 text-[11px]">
              Telah diserahkan barang operasional / habis pakai madrasah kepada pemohon dengan rincian sebagai berikut:
            </p>

            <table className="w-full mb-4 text-[11px]">
              <tbody>
                <tr>
                  <td className="w-32 py-1 font-semibold text-slate-700">Nama Pemohon</td>
                  <td className="py-1">: <span className="font-bold text-slate-900">{request.applicant}</span></td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">Peran / Unit Kerja</td>
                  <td className="py-1">: {request.role} ({request.unitOrClass})</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">Kontak WhatsApp</td>
                  <td className="py-1">: {request.contact}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">Tujuan Pemakaian</td>
                  <td className="py-1">: {request.purpose}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">Tanggal Diserahkan</td>
                  <td className="py-1">: <span className="font-mono">{request.requestDate}</span></td>
                </tr>
              </tbody>
            </table>

            {/* Item Table */}
            <div className="border border-slate-900 mb-4 overflow-hidden rounded font-sans">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 border-b border-slate-900 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-900 w-8 text-center">No</th>
                    <th className="p-2 border-r border-slate-900">Kode Barang</th>
                    <th className="p-2 border-r border-slate-900">Nama Barang Habis Pakai</th>
                    <th className="p-2 text-center w-24">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-r border-slate-900 text-center">1</td>
                    <td className="p-2 border-r border-slate-900 font-mono text-[10px]">{request.itemCode}</td>
                    <td className="p-2 border-r border-slate-900 font-semibold">{request.itemName}</td>
                    <td className="p-2 text-center font-bold">{request.qty} {request.unit}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-slate-500 italic mb-6">
              Catatan: Barang di atas adalah perlengkapan habis pakai untuk menunjang kegiatan madrasah dan tidak perlu dikembalikan ke bagian Sarpras.
            </p>

            {/* Signature */}
            <div className="grid grid-cols-2 text-center text-[11px] pt-2 font-sans">
              <div>
                <p className="text-slate-600 mb-14">Pemohon / Penerima,</p>
                <p className="font-bold underline text-slate-900">{request.applicant}</p>
                <p className="text-[10px] text-slate-500">{request.unitOrClass}</p>
              </div>

              <div>
                <p className="text-slate-600 mb-14">Petugas Pengelola Sarpras,</p>
                <p className="font-bold underline text-slate-900">{request.petugas}</p>
                <p className="text-[10px] text-slate-500">MTs Muhammadiyah Metro</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
