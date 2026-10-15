import React, { useState, useMemo } from 'react';
import type { InventoryItem, ItemCondition } from '../types/inventory.ts';
import { 
  Search, 
  Filter, 
  Plus, 
  QrCode, 
  Edit3, 
  Trash2, 
  ArrowUpDown, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowDownCircle, 
  ArrowUpCircle,
  PackagePlus,
  Tag
} from 'lucide-react';
import { formatCurrencyIDR } from '../utils/inventoryLogic.ts';

interface InventoryViewProps {
  items: InventoryItem[];
  categories: string[];
  locations: string[];
  onOpenAddItem: () => void;
  onOpenEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string, name: string) => void;
  onOpenLabelModal: (item: InventoryItem) => void;
  onQuickInbound: (item: InventoryItem) => void;
  onQuickOutbound: (item: InventoryItem) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  categories,
  locations,
  onOpenAddItem,
  onOpenEditItem,
  onDeleteItem,
  onOpenLabelModal,
  onQuickInbound,
  onQuickOutbound
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'qty_desc' | 'qty_asc' | 'price_desc' | 'code'>('name');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        (item.desc && item.desc.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = !selectedCategory || item.category === selectedCategory;
      const matchLocation = !selectedLocation || item.location === selectedLocation;
      const matchCondition = !selectedCondition || item.condition === selectedCondition;

      return matchSearch && matchCategory && matchLocation && matchCondition;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'qty_desc') return (b.qty || 0) - (a.qty || 0);
      if (sortBy === 'qty_asc') return (a.qty || 0) - (b.qty || 0);
      if (sortBy === 'price_desc') return ((b.pricePerUnit || 0) * (b.qty || 0)) - ((a.pricePerUnit || 0) * (a.qty || 0));
      if (sortBy === 'code') return a.code.localeCompare(b.code);
      return 0;
    });
  }, [items, search, selectedCategory, selectedLocation, selectedCondition, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Bar */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode, nama barang, merk, atau spesifikasi sarpras..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddItem}
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-lg shadow-cyan-600/25 flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Sarpras Baru</span>
            </button>
          </div>

        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5 text-xs">
          
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-slate-200 focus:border-cyan-400 focus:outline-none"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Lokasi / Ruangan
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-slate-200 focus:border-cyan-400 focus:outline-none"
            >
              <option value="">Semua Lokasi</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Kondisi Fisik
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-slate-200 focus:border-cyan-400 focus:outline-none"
            >
              <option value="">Semua Kondisi</option>
              <option value="Baik">Baik</option>
              <option value="Kurang Baik">Kurang Baik</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Urutkan Berdasarkan
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-slate-200 focus:border-cyan-400 focus:outline-none"
            >
              <option value="name">Nama Barang (A-Z)</option>
              <option value="qty_desc">Stok Terbanyak</option>
              <option value="qty_asc">Stok Tersedikit</option>
              <option value="price_desc">Nilai Aset Tertinggi</option>
              <option value="code">Kode Registrasi</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base font-heading">
              Katalog Inventaris Sarpras Madrasah
            </h3>
            <p className="text-xs text-slate-400">
              Menampilkan {filteredItems.length} dari total {items.length} sarana & prasarana
            </p>
          </div>
          {(selectedCategory || selectedLocation || selectedCondition || search) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('');
                setSelectedLocation('');
                setSelectedCondition('');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Kode & Nama Sarpras</th>
                <th className="py-3.5 px-4">Kategori & Lokasi</th>
                <th className="py-3.5 px-4 text-center">Stok / Satuan</th>
                <th className="py-3.5 px-4 text-center">Kondisi</th>
                <th className="py-3.5 px-4 text-right">Nilai Aset</th>
                <th className="py-3.5 px-4">Sumber / Tgl</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <PackagePlus className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-300 text-sm">Tidak ada barang yang cocok</p>
                    <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau reset filter</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = Number(item.qty) <= Number(item.minStock);
                  const totalValue = (Number(item.qty) || 0) * (Number(item.pricePerUnit) || 0);

                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition">
                      
                      {/* Code & Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100 text-sm">{item.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono-code text-[11px] text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                            {item.code}
                          </span>
                          {item.desc && (
                            <span className="text-[11px] text-slate-400 truncate max-w-[200px]" title={item.desc}>
                              &bull; {item.desc}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category & Location */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{item.category}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                          <Tag className="w-3 h-3 text-indigo-400" />
                          <span>{item.location}</span>
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`font-bold text-sm px-2.5 py-0.5 rounded-lg ${
                            isLow 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                              : 'bg-slate-800 text-slate-200'
                          }`}>
                            {item.qty} {item.unit}
                          </span>
                          {isLow && (
                            <span className="text-[10px] text-amber-400 mt-0.5 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Min: {item.minStock}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Condition */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          item.condition === 'Baik'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            : item.condition === 'Kurang Baik'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        }`}>
                          {item.condition}
                        </span>
                      </td>

                      {/* Asset Value */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-semibold text-slate-200">
                          {formatCurrencyIDR(totalValue)}
                        </div>
                        {item.pricePerUnit ? (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            @{formatCurrencyIDR(item.pricePerUnit)}
                          </div>
                        ) : null}
                      </td>

                      {/* Funding & Date */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-white/5">
                          {item.fundingSource || 'BOS / Yayasan'}
                        </span>
                        {item.purchaseDate && (
                          <div className="text-[10px] text-slate-500 mt-0.5 font-mono-code">
                            {item.purchaseDate}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Quick Inbound */}
                          <button
                            onClick={() => onQuickInbound(item)}
                            className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                            title="Tambah Stok (Barang Masuk)"
                          >
                            <ArrowDownCircle className="w-4 h-4" />
                          </button>

                          {/* Quick Outbound */}
                          <button
                            onClick={() => onQuickOutbound(item)}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            title="Kurang Stok (Barang Keluar)"
                          >
                            <ArrowUpCircle className="w-4 h-4" />
                          </button>

                          {/* Asset Label / Barcode */}
                          <button
                            onClick={() => onOpenLabelModal(item)}
                            className="p-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition"
                            title="Cetak Label QR / Barcode Aset"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* Edit Item */}
                          <button
                            onClick={() => onOpenEditItem(item)}
                            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                            title="Edit Data Barang"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => onDeleteItem(item.id, item.name)}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            title="Hapus Barang"
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
