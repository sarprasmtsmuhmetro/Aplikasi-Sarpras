import React, { useState } from 'react';
import { Tags, MapPin, Plus, Trash2, Layers } from 'lucide-react';
import type { InventoryItem } from '../types/inventory.ts';

interface CategoriesViewProps {
  categories: string[];
  locations: string[];
  items: InventoryItem[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
  onAddLocation: (name: string) => void;
  onDeleteLocation: (name: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  locations,
  items,
  onAddCategory,
  onDeleteCategory,
  onAddLocation,
  onDeleteLocation
}) => {
  const [newCat, setNewCat] = useState('');
  const [newLoc, setNewLoc] = useState('');

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim()) {
      onAddCategory(newCat.trim());
      setNewCat('');
    }
  };

  const handleAddLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLoc.trim()) {
      onAddLocation(newLoc.trim());
      setNewLoc('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Categories Card */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tags className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-heading">
              Daftar Kategori Sarpras
            </h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
            {categories.length} Kategori
          </span>
        </div>

        <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Tambah nama kategori baru..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </form>

        <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-slate-950/40">
          {categories.map((cat) => {
            const itemCount = items.filter(i => i.category === cat).length;
            return (
              <div key={cat} className="p-3 flex items-center justify-between hover:bg-white/5 transition text-xs">
                <div>
                  <span className="font-semibold text-slate-200">{cat}</span>
                  <span className="text-slate-400 text-[11px] block">{itemCount} barang dalam kategori ini</span>
                </div>
                <button
                  onClick={() => onDeleteCategory(cat)}
                  disabled={categories.length <= 1}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition disabled:opacity-30"
                  title="Hapus kategori"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Locations Card */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-heading">
              Daftar Lokasi / Ruangan Penyimpanan
            </h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
            {locations.length} Lokasi
          </span>
        </div>

        <form onSubmit={handleAddLocationSubmit} className="flex gap-2">
          <input
            type="text"
            value={newLoc}
            onChange={(e) => setNewLoc(e.target.value)}
            placeholder="Tambah nama ruangan / lab / gudang baru..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder-slate-400 focus:border-indigo-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </form>

        <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-slate-950/40">
          {locations.map((loc) => {
            const itemCount = items.filter(i => i.location === loc).length;
            return (
              <div key={loc} className="p-3 flex items-center justify-between hover:bg-white/5 transition text-xs">
                <div>
                  <span className="font-semibold text-slate-200">{loc}</span>
                  <span className="text-slate-400 text-[11px] block">{itemCount} barang ditempatkan di sini</span>
                </div>
                <button
                  onClick={() => onDeleteLocation(loc)}
                  disabled={locations.length <= 1}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition disabled:opacity-30"
                  title="Hapus lokasi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
