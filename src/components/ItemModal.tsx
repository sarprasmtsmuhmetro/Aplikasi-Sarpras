import React, { useState, useEffect } from 'react';
import type { InventoryItem, ItemCondition, FundingSource, ItemType } from '../types/inventory.ts';
import { X, Sparkles, Box, Check, PackageOpen } from 'lucide-react';
import { generateAssetCode } from '../utils/inventoryLogic.ts';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => void;
  itemToEdit?: InventoryItem | null;
  categories: string[];
  locations: string[];
  existingCodes: string[];
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
  categories,
  locations,
  existingCodes
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [minStock, setMinStock] = useState<number>(2);
  const [condition, setCondition] = useState<ItemCondition>('Baik');
  const [unit, setUnit] = useState('unit');
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [fundingSource, setFundingSource] = useState<FundingSource>('Dana BOS');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [itemType, setItemType] = useState<ItemType>('ASET');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setCode(itemToEdit.code);
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setLocation(itemToEdit.location);
      setQty(itemToEdit.qty);
      setMinStock(itemToEdit.minStock);
      setCondition(itemToEdit.condition);
      setUnit(itemToEdit.unit || 'unit');
      setPricePerUnit(itemToEdit.pricePerUnit || 0);
      setFundingSource(itemToEdit.fundingSource || 'Dana BOS');
      setPurchaseDate(itemToEdit.purchaseDate || '');
      setItemType(itemToEdit.itemType || 'ASET');
      setDesc(itemToEdit.desc || '');
    } else {
      const initialCat = categories[0] || 'Elektronik & Multimedia';
      const initialLoc = locations[0] || 'Gudang Utama Sarpras';
      setCode(generateAssetCode('SAR', existingCodes));
      setName('');
      setCategory(initialCat);
      setLocation(initialLoc);
      setQty(1);
      setMinStock(2);
      setCondition('Baik');
      setUnit('unit');
      setPricePerUnit(0);
      setFundingSource('Dana BOS');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setItemType('ASET');
      setDesc('');
    }
  }, [itemToEdit, isOpen, categories, locations, existingCodes]);

  if (!isOpen) return null;

  const handleGenerateCode = () => {
    let prefix = 'SAR';
    if (category.toLowerCase().includes('elektronik')) prefix = 'SAR-EL';
    else if (category.toLowerCase().includes('lab')) prefix = 'SAR-LAB';
    else if (category.toLowerCase().includes('mebel')) prefix = 'SAR-MEB';
    else if (category.toLowerCase().includes('olahraga')) prefix = 'SAR-OLR';

    setCode(generateAssetCode(prefix, existingCodes));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: itemToEdit ? itemToEdit.id : undefined,
      code: code.trim(),
      name: name.trim(),
      category,
      location,
      qty: Number(qty) || 0,
      minStock: Number(minStock) || 0,
      condition,
      unit,
      pricePerUnit: Number(pricePerUnit) || 0,
      fundingSource,
      purchaseDate,
      itemType,
      desc: desc.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Box className="w-5 h-5 text-cyan-200" />
            <h3 className="font-bold text-base font-heading">
              {itemToEdit ? 'Edit Sarana & Prasarana' : 'Tambah Sarana & Prasarana Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-cyan-200 hover:text-white transition p-1"
            aria-label="Tutup form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Item Type Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">
              Klasifikasi Jenis Barang *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setItemType('ASET');
                  if (!itemToEdit && code.startsWith('BHP-')) {
                    setCode(generateAssetCode('SAR', existingCodes));
                  }
                }}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  itemType === 'ASET'
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-800 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Box className="w-4 h-4 shrink-0 text-cyan-400" />
                <div>
                  <span className="font-bold block text-white text-xs">Sarana / Aset Tetap</span>
                  <span className="text-[10px] text-slate-400">Dipinjam & Dikembalikan</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setItemType('HABIS_PAKAI');
                  if (!itemToEdit && code.startsWith('SAR-')) {
                    setCode(generateAssetCode('BHP', existingCodes));
                  }
                }}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  itemType === 'HABIS_PAKAI'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <PackageOpen className="w-4 h-4 shrink-0 text-amber-400" />
                <div>
                  <span className="font-bold block text-white text-xs">Barang Habis Pakai (BHP)</span>
                  <span className="text-[10px] text-slate-400">ATK, Kertas, Spidol, Baterai</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Row 1: Code & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Kode Registrasi Aset *
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="SAR-0001"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white font-mono-code focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl transition text-[11px] font-semibold shrink-0"
                  title="Generate kode otomatis"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Nama Barang / Sarpras *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Proyektor Epson EB-X450"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none text-sm font-semibold"
              />
            </div>
          </div>

          {/* Row 2: Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Kategori Sarpras *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Lokasi / Ruangan Penyimpanan *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Qty, Unit, Min Stock, Condition */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Jumlah Stok *
              </label>
              <input
                type="number"
                min="0"
                required
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white font-bold text-center focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Satuan *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="unit">unit</option>
                <option value="buah">buah</option>
                <option value="set">set</option>
                <option value="paket">paket</option>
                <option value="rim">rim</option>
                <option value="box">box</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Batas Min. Stok *
              </label>
              <input
                type="number"
                min="0"
                required
                value={minStock}
                onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-center focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Kondisi Fisik *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="Baik">Baik</option>
                <option value="Kurang Baik">Kurang Baik</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>
          </div>

          {/* Row 4: Price & Funding */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Harga / Nilai Satuan (Rp)
              </label>
              <input
                type="number"
                min="0"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Sumber Anggaran
              </label>
              <select
                value={fundingSource}
                onChange={(e) => setFundingSource(e.target.value as FundingSource)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="Dana BOS">Dana BOS</option>
                <option value="Komite Madrasah">Komite Madrasah</option>
                <option value="Yayasan Muhammadiyah">Yayasan Muhammadiyah</option>
                <option value="Hibah / Bantuan">Hibah / Bantuan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Tanggal Perolehan
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Description */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Spesifikasi, Merk & Keterangan Tambahan
            </label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Nomor seri, kelengkapan adaptor, remote, kabel HDMI, kondisi fisik..."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-400 focus:outline-none resize-none"
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white transition font-bold shadow-lg shadow-cyan-600/30 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Sarpras</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
