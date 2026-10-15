import React, { useState } from 'react';
import type { InventoryItem } from '../types/inventory.ts';
import { X, Printer, QrCode, Building2, Copy, Check } from 'lucide-react';

interface AssetLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

export const AssetLabelModal: React.FC<AssetLabelModalProps> = ({
  isOpen,
  onClose,
  item
}) => {
  const [copied, setCopied] = useState(false);
  const [printCopies, setPrintCopies] = useState<number>(4);

  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(item.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate deterministic barcode bars based on item.code string
  const getBarcodeBars = (code: string) => {
    const bars: number[] = [];
    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i);
      bars.push((charCode % 3) + 1);
      bars.push(1);
      bars.push((charCode % 2) + 1);
      bars.push(1);
    }
    return bars;
  };

  const barcodePattern = getBarcodeBars(item.code);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-fade-in text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-cyan-200" />
            <h3 className="font-bold text-base font-heading">
              Cetak Label Barcode & Kartu Aset Sarpras
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

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-white/5 no-print text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Jumlah Cetak Label:</span>
              <select
                value={printCopies}
                onChange={(e) => setPrintCopies(parseInt(e.target.value) || 1)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-white font-bold"
              >
                <option value={1}>1 Label (Tunggal)</option>
                <option value={2}>2 Label</option>
                <option value={4}>4 Label (Ukuran Stiker Sedang)</option>
                <option value={6}>6 Label</option>
                <option value={8}>8 Label (Ukuran Stiker Folio)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition flex items-center gap-1.5 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Kode'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sekarang (Print)</span>
              </button>
            </div>
          </div>

          {/* Printable Label Grid Preview */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: printCopies }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white text-slate-950 p-4 rounded-xl border-2 border-slate-900 shadow-md print-break-inside flex flex-col justify-between"
                  style={{ minHeight: '165px' }}
                >
                  {/* Label Header */}
                  <div className="border-b-2 border-slate-900 pb-1.5 mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-slate-900 rounded-sm flex items-center justify-center text-white text-[10px] font-black">
                        M
                      </div>
                      <div>
                        <div className="text-[10px] font-black tracking-wider uppercase leading-none font-heading">
                          MTS MUHAMMADIYAH METRO
                        </div>
                        <div className="text-[8px] font-bold text-slate-600 tracking-tight leading-tight">
                          INVENTARIS SARANA & PRASARANA
                        </div>
                      </div>
                    </div>
                    <div className="text-[9px] font-mono-code font-bold bg-slate-100 px-1 py-0.5 border border-slate-300">
                      {item.fundingSource || 'BOS'}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-1 mb-2">
                    <div className="text-xs font-black tracking-normal leading-tight break-words">
                      {item.name}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-700">
                      <div>
                        <span className="text-slate-500">Kategori: </span>
                        <span className="font-semibold">{item.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Ruangan: </span>
                        <span className="font-semibold">{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Barcode & Code */}
                  <div className="flex flex-col items-center justify-center pt-1 border-t border-dashed border-slate-300">
                    <div className="flex items-end justify-center h-8 gap-[1.5px] w-full px-2">
                      {barcodePattern.map((width, bIdx) => (
                        <div
                          key={bIdx}
                          className="bg-black h-full"
                          style={{ width: `${width * 1.5}px` }}
                        />
                      ))}
                    </div>
                    <div className="text-[11px] font-mono-code font-black tracking-widest mt-0.5">
                      *{item.code}*
                    </div>
                  </div>

                  {/* Label Footer */}
                  <div className="text-[7px] text-slate-400 text-center tracking-tighter uppercase font-semibold mt-1">
                    Milik Madrasah &bull; Dilarang melepas atau merusak label ini
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
