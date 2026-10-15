import React, { useState, useEffect } from 'react';
import type { 
  AppState, 
  InventoryItem, 
  LoanRecord, 
  TransactionType, 
  MaintenanceRecord,
  MaintenanceStatus,
  ItemCondition,
  ConsumableRequest
} from './types/inventory.ts';
import { loadAppState, saveAppState } from './utils/storage.ts';
import { exportAllToExcel, parseExcelItems } from './utils/excelHelper.ts';
import { filterConsumables, filterFixedAssets } from './utils/inventoryLogic.ts';
import { Navbar } from './components/Navbar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { InventoryView } from './components/InventoryView.tsx';
import { LoansView } from './components/LoansView.tsx';
import { ConsumablesView } from './components/ConsumablesView.tsx';
import { TransactionsView } from './components/TransactionsView.tsx';
import { MaintenanceView } from './components/MaintenanceView.tsx';
import { StockOpnameView } from './components/StockOpnameView.tsx';
import { CategoriesView } from './components/CategoriesView.tsx';
import { PublicPortalView } from './components/PublicPortalView.tsx';
import { PortalLinksView } from './components/PortalLinksView.tsx';
import { ItemModal } from './components/ItemModal.tsx';
import { LoanModal } from './components/LoanModal.tsx';
import { ReturnLoanModal } from './components/ReturnLoanModal.tsx';
import { TransactionModal } from './components/TransactionModal.tsx';
import { MaintenanceModal } from './components/MaintenanceModal.tsx';
import { AssetLabelModal } from './components/AssetLabelModal.tsx';
import { PrintLoanReceiptModal } from './components/PrintLoanReceiptModal.tsx';
import { PrintConsumableReceiptModal } from './components/PrintConsumableReceiptModal.tsx';
import { ShareLinksModal } from './components/ShareLinksModal.tsx';
import { ToastContainer, ToastMessage } from './components/Toast.tsx';

import { 
  LayoutDashboard, 
  Boxes, 
  Handshake, 
  History, 
  Wrench, 
  ClipboardCheck, 
  Tags, 
  Building2,
  PackageOpen,
  Share2,
  Link2
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Public Form Portal Mode (activated via URL ?form=pinjam or ?form=habis-pakai)
  const [publicPortalType, setPublicPortalType] = useState<'pinjam' | 'habis-pakai' | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const form = params.get('form');
      if (form === 'pinjam' || form === 'habis-pakai') return form;
    }
    return null;
  });

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanToReturn, setLoanToReturn] = useState<LoanRecord | null>(null);

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txType, setTxType] = useState<TransactionType>('IN');
  const [txPreselectedItem, setTxPreselectedItem] = useState<InventoryItem | null>(null);

  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);
  const [itemForLabel, setItemForLabel] = useState<InventoryItem | null>(null);
  const [loanForReceipt, setLoanForReceipt] = useState<LoanRecord | null>(null);

  // BHP & Share modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [requestForSlip, setRequestForSlip] = useState<ConsumableRequest | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Listen to popstate for back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const form = params.get('form');
      if (form === 'pinjam' || form === 'habis-pakai') {
        setPublicPortalType(form);
      } else {
        setPublicPortalType(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Item Handlers ---
  const handleOpenAddItem = () => {
    setItemToEdit(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: InventoryItem) => {
    setItemToEdit(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (itemData: Partial<InventoryItem>) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (itemData.id) {
      // Edit existing
      setState(prev => {
        const updated = prev.items.map(item => {
          if (item.id === itemData.id) {
            return {
              ...item,
              ...itemData,
              lastUpdated: dateStr
            } as InventoryItem;
          }
          return item;
        });
        return { ...prev, items: updated };
      });
      addToast(`Data barang "${itemData.name}" berhasil diperbarui.`, 'success');
    } else {
      // New Item
      const newItem: InventoryItem = {
        id: `item-${Date.now()}`,
        code: itemData.code || `SAR-${Date.now().toString().slice(-4)}`,
        name: itemData.name || 'Barang Baru',
        category: itemData.category || prevOrFirst(state.categories),
        location: itemData.location || prevOrFirst(state.locations),
        qty: Number(itemData.qty) || 0,
        minStock: Number(itemData.minStock) || 2,
        condition: itemData.condition || 'Baik',
        unit: itemData.unit || 'unit',
        pricePerUnit: Number(itemData.pricePerUnit) || 0,
        fundingSource: itemData.fundingSource || 'Dana BOS',
        purchaseDate: itemData.purchaseDate || dateStr,
        desc: itemData.desc || '',
        lastUpdated: dateStr
      };

      setState(prev => ({
        ...prev,
        items: [...prev.items, newItem],
        transactions: [
          ...prev.transactions,
          {
            id: `tx-${Date.now()}`,
            date: timeStr,
            type: 'IN',
            itemId: newItem.id,
            itemCode: newItem.code,
            itemName: newItem.name,
            qty: newItem.qty,
            sourceOrDestination: `Pengadaan Awal (${newItem.fundingSource || 'Madrasah'})`,
            petugas: 'Petugas Sarpras'
          }
        ]
      }));
      addToast(`Barang baru "${newItem.name}" berhasil didaftarkan ke sistem!`, 'success');
    }
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${name}" dari inventaris sarpras?`)) {
      setState(prev => ({
        ...prev,
        items: prev.items.filter(i => i.id !== id),
        loans: prev.loans.filter(l => l.itemId !== id)
      }));
      addToast(`Barang "${name}" telah dihapus.`, 'info');
    }
  };

  // --- Loan Handlers ---
  const handleOpenNewLoan = () => {
    setIsLoanModalOpen(true);
  };

  const handleSaveLoan = (loanData: Omit<LoanRecord, 'id' | 'status'>) => {
    const newId = `loan-${Date.now()}`;
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLoanRecord: LoanRecord = {
      ...loanData,
      id: newId,
      status: 'DIPINJAM'
    };

    setState(prev => {
      // Deduct item qty
      const updatedItems = prev.items.map(item => {
        if (item.id === loanData.itemId) {
          return {
            ...item,
            qty: Math.max(0, item.qty - loanData.qty),
            lastUpdated: now.toISOString().split('T')[0]
          };
        }
        return item;
      });

      // Log transaction
      const newTx = {
        id: `tx-${Date.now()}`,
        date: timeStr,
        type: 'OUT' as TransactionType,
        itemId: loanData.itemId,
        itemCode: loanData.itemCode,
        itemName: loanData.itemName,
        qty: loanData.qty,
        sourceOrDestination: `Dipinjam: ${loanData.borrower} (${loanData.contact})`,
        petugas: loanData.petugas,
        notes: loanData.purpose
      };

      return {
        ...prev,
        items: updatedItems,
        loans: [...prev.loans, newLoanRecord],
        transactions: [...prev.transactions, newTx]
      };
    });

    addToast(`Peminjaman "${loanData.itemName}" oleh ${loanData.borrower} berhasil dicatat!`, 'success');
  };

  const handleSaveConsumableRequest = (requestData: Omit<ConsumableRequest, 'id'>) => {
    const newId = `bhp-req-${Date.now()}`;
    const now = new Date();
    const timeStr = `${requestData.requestDate} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRequest: ConsumableRequest = {
      ...requestData,
      id: newId
    };

    setState(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === requestData.itemId) {
          return {
            ...item,
            qty: Math.max(0, item.qty - requestData.qty),
            lastUpdated: requestData.requestDate
          };
        }
        return item;
      });

      const newTx: TransactionRecord = {
        id: `tx-${Date.now()}`,
        date: timeStr,
        type: 'OUT',
        itemId: requestData.itemId,
        itemCode: requestData.itemCode,
        itemName: requestData.itemName,
        qty: requestData.qty,
        sourceOrDestination: `Pengeluaran BHP: ${requestData.applicant} (${requestData.unitOrClass})`,
        petugas: requestData.petugas,
        notes: requestData.purpose
      };

      return {
        ...prev,
        items: updatedItems,
        consumableRequests: [...(prev.consumableRequests || []), newRequest],
        transactions: [...prev.transactions, newTx]
      };
    });

    addToast(`Pengeluaran BHP "${requestData.itemName}" untuk ${requestData.applicant} berhasil dicatat!`, 'success');
  };

  const handleOpenReturnLoan = (loan: LoanRecord) => {
    setLoanToReturn(loan);
  };

  const handleConfirmReturn = (loanId: string, returnData: {
    returnDate: string;
    conditionOnReturn: ItemCondition;
    notes?: string;
    petugas: string;
  }) => {
    const loan = state.loans.find(l => l.id === loanId);
    if (!loan) return;

    const now = new Date();
    const timeStr = `${returnData.returnDate} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setState(prev => {
      const updatedLoans = prev.loans.map(l => {
        if (l.id === loanId) {
          return {
            ...l,
            status: 'DIKEMBALIKAN' as const,
            returnDate: returnData.returnDate,
            conditionOnReturn: returnData.conditionOnReturn,
            notes: returnData.notes
          };
        }
        return l;
      });

      const updatedItems = prev.items.map(item => {
        if (item.id === loan.itemId) {
          return {
            ...item,
            qty: item.qty + loan.qty,
            condition: returnData.conditionOnReturn || item.condition,
            lastUpdated: returnData.returnDate
          };
        }
        return item;
      });

      const newTx = {
        id: `tx-${Date.now()}`,
        date: timeStr,
        type: 'IN' as TransactionType,
        itemId: loan.itemId,
        itemCode: loan.itemCode,
        itemName: loan.itemName,
        qty: loan.qty,
        sourceOrDestination: `Pengembalian dari: ${loan.borrower}`,
        petugas: returnData.petugas,
        notes: returnData.notes
      };

      return {
        ...prev,
        loans: updatedLoans,
        items: updatedItems,
        transactions: [...prev.transactions, newTx]
      };
    });

    addToast(`Barang "${loan.itemName}" berhasil dikembalikan ke sarpras!`, 'success');
  };

  const handleDeleteLoan = (id: string, borrower: string) => {
    if (confirm(`Hapus catatan peminjaman oleh ${borrower}?`)) {
      setState(prev => ({
        ...prev,
        loans: prev.loans.filter(l => l.id !== id)
      }));
      addToast('Catatan peminjaman telah dihapus.', 'info');
    }
  };

  // --- Transactions Quick Handlers ---
  const handleQuickInbound = (item?: InventoryItem) => {
    setTxType('IN');
    setTxPreselectedItem(item || null);
    setIsTxModalOpen(true);
  };

  const handleQuickOutbound = (item?: InventoryItem) => {
    setTxType('OUT');
    setTxPreselectedItem(item || null);
    setIsTxModalOpen(true);
  };

  const handleQuickMutasi = () => {
    setTxType('MUTASI');
    setTxPreselectedItem(null);
    setIsTxModalOpen(true);
  };

  const handleConfirmTransaction = (data: {
    type: TransactionType;
    itemId: string;
    qty: number;
    sourceOrDestination: string;
    targetLocation?: string;
    petugas: string;
    notes?: string;
  }) => {
    const item = state.items.find(i => i.id === data.itemId);
    if (!item) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setState(prev => {
      const updatedItems = prev.items.map(i => {
        if (i.id === data.itemId) {
          let newQty = i.qty;
          let newLoc = i.location;
          if (data.type === 'IN') newQty += data.qty;
          else if (data.type === 'OUT') newQty = Math.max(0, i.qty - data.qty);
          else if (data.type === 'MUTASI' && data.targetLocation) newLoc = data.targetLocation;

          return {
            ...i,
            qty: newQty,
            location: newLoc,
            lastUpdated: dateStr
          };
        }
        return i;
      });

      const newTx = {
        id: `tx-${Date.now()}`,
        date: timeStr,
        type: data.type,
        itemId: item.id,
        itemCode: item.code,
        itemName: item.name,
        qty: data.qty,
        sourceOrDestination: data.type === 'MUTASI'
          ? `Mutasi dari "${item.location}" ke "${data.targetLocation}"`
          : data.sourceOrDestination,
        petugas: data.petugas,
        notes: data.notes
      };

      return {
        ...prev,
        items: updatedItems,
        transactions: [...prev.transactions, newTx]
      };
    });

    addToast(`Transaksi ${data.type} untuk "${item.name}" berhasil dicatat!`, 'success');
  };

  // --- Maintenance Handlers ---
  const handleOpenNewMaintenance = () => {
    setIsMaintModalOpen(true);
  };

  const handleSaveMaintenance = (record: Omit<MaintenanceRecord, 'id' | 'status'>) => {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: `m-${Date.now()}`,
      status: 'MENUNGGU'
    };
    setState(prev => ({
      ...prev,
      maintenance: [...prev.maintenance, newRecord]
    }));
    addToast(`Laporan perbaikan untuk "${record.itemName}" telah dicatat.`, 'success');
  };

  const handleUpdateMaintenanceStatus = (id: string, newStatus: MaintenanceStatus) => {
    setState(prev => ({
      ...prev,
      maintenance: prev.maintenance.map(m => m.id === id ? { ...m, status: newStatus } : m)
    }));
    addToast('Status pemeliharaan diperbarui.', 'info');
  };

  const handleDeleteMaintenance = (id: string) => {
    setState(prev => ({
      ...prev,
      maintenance: prev.maintenance.filter(m => m.id !== id)
    }));
    addToast('Catatan pemeliharaan dihapus.', 'info');
  };

  // --- Stock Opname Handler ---
  const handleApplyStockOpname = (adjustments: { id: string; newQty: number; note: string }[]) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setState(prev => {
      const newTransactions = [...prev.transactions];
      const updatedItems = prev.items.map(item => {
        const adj = adjustments.find(a => a.id === item.id);
        if (adj) {
          const diff = adj.newQty - item.qty;
          newTransactions.push({
            id: `tx-${Date.now()}-${item.id}`,
            date: timeStr,
            type: diff >= 0 ? 'IN' : 'OUT',
            itemId: item.id,
            itemCode: item.code,
            itemName: item.name,
            qty: Math.abs(diff),
            sourceOrDestination: `Audit Stock Opname Fisik: ${diff >= 0 ? 'Kelebihan Fisik' : 'Kekurangan Fisik'}`,
            petugas: 'Tim Audit Sarpras',
            notes: adj.note
          });

          return {
            ...item,
            qty: adj.newQty,
            lastUpdated: dateStr
          };
        }
        return item;
      });

      return {
        ...prev,
        items: updatedItems,
        transactions: newTransactions
      };
    });

    addToast(`Berhasil menerapkan hasil stock opname untuk ${adjustments.length} barang!`, 'success');
  };

  // --- Categories & Locations ---
  const handleAddCategory = (name: string) => {
    if (!state.categories.includes(name)) {
      setState(prev => ({ ...prev, categories: [...prev.categories, name] }));
      addToast(`Kategori "${name}" berhasil ditambahkan.`, 'success');
    }
  };

  const handleDeleteCategory = (name: string) => {
    setState(prev => ({ ...prev, categories: prev.categories.filter(c => c !== name) }));
    addToast(`Kategori "${name}" dihapus.`, 'info');
  };

  const handleAddLocation = (name: string) => {
    if (!state.locations.includes(name)) {
      setState(prev => ({ ...prev, locations: [...prev.locations, name] }));
      addToast(`Lokasi ruangan "${name}" berhasil ditambahkan.`, 'success');
    }
  };

  const handleDeleteLocation = (name: string) => {
    setState(prev => ({ ...prev, locations: prev.locations.filter(l => l !== name) }));
    addToast(`Lokasi ruangan "${name}" dihapus.`, 'info');
  };

  // --- Excel Export & Import ---
  const handleExportExcel = () => {
    try {
      exportAllToExcel(state);
      addToast('Laporan Excel lengkap berhasil diunduh!', 'success');
    } catch (e) {
      console.error(e);
      addToast('Gagal mengekspor file Excel.', 'error');
    }
  };

  const handleImportExcel = async (file: File) => {
    try {
      const parsed = await parseExcelItems(file);
      if (parsed.length === 0) {
        addToast('File Excel kosong atau tidak sesuai format.', 'error');
        return;
      }

      setState(prev => {
        const newCats = [...prev.categories];
        const newLocs = [...prev.locations];

        const importedItems: InventoryItem[] = parsed.map((p, idx) => {
          if (p.category && !newCats.includes(p.category)) newCats.push(p.category);
          if (p.location && !newLocs.includes(p.location)) newLocs.push(p.location);

          return {
            id: `item-imp-${Date.now()}-${idx}`,
            code: p.code || `SAR-IMP-${idx}`,
            name: p.name || 'Barang Import',
            category: p.category || 'Lainnya',
            location: p.location || 'Gudang Utama Sarpras',
            qty: p.qty || 0,
            minStock: p.minStock || 2,
            condition: p.condition || 'Baik',
            unit: p.unit || 'unit',
            pricePerUnit: p.pricePerUnit || 0,
            fundingSource: p.fundingSource || 'Dana BOS',
            purchaseDate: p.purchaseDate || new Date().toISOString().split('T')[0],
            desc: p.desc || 'Diimpor dari file Excel',
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        });

        return {
          ...prev,
          categories: newCats,
          locations: newLocs,
          items: [...prev.items, ...importedItems]
        };
      });

      addToast(`Berhasil mengimpor ${parsed.length} barang dari file Excel!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Gagal memproses file Excel. Pastikan format kolom valid.', 'error');
    }
  };

  const existingCodes = state.items.map(i => i.code);
  const activeLoansCount = state.loans.filter(l => l.status === 'DIPINJAM' || l.status === 'TERLAMBAT').length;
  const maintenanceCount = state.maintenance.filter(m => m.status === 'MENUNGGU' || m.status === 'DALAM_PENGERJAAN').length;

  // If user accesses via public link (?form=pinjam or ?form=habis-pakai), show self-service form
  if (publicPortalType) {
    return (
      <>
        <PublicPortalView
          initialFormType={publicPortalType}
          items={state.items}
          existingLoans={state.loans}
          existingRequests={state.consumableRequests || []}
          onBackToAdmin={() => {
            window.history.pushState({}, '', window.location.pathname);
            setPublicPortalType(null);
          }}
          onSubmitLoan={handleSaveLoan}
          onSubmitConsumableRequest={handleSaveConsumableRequest}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  const bhpCount = filterConsumables(state.items).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        onOpenAddItem={handleOpenAddItem}
        onOpenNewLoan={handleOpenNewLoan}
        onExportExcel={handleExportExcel}
        onImportExcel={handleImportExcel}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        itemsCount={state.items.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-white/5 scroll-smooth">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Daftar Barang</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-bold">
              {state.items.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('loans')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 ${
              activeTab === 'loans'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Handshake className="w-4 h-4" />
            <span>Peminjaman</span>
            {activeLoansCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200 font-bold border border-indigo-500/40">
                {activeLoansCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('consumables')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 ${
              activeTab === 'consumables'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PackageOpen className="w-4 h-4" />
            <span>Barang Habis Pakai (BHP)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300 font-bold">
              {bhpCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portalLinks')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 ${
              activeTab === 'portalLinks'
                ? 'bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-cyan-300 hover:text-white hover:bg-cyan-500/10 border border-cyan-500/30'
            }`}
          >
            <Link2 className="w-4 h-4 text-cyan-400" />
            <span>Link Form Online</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40">
              Publik
            </span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 ${
              activeTab === 'transactions'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat Transaksi</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 ${
              activeTab === 'maintenance'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Servis & Pemeliharaan</span>
            {maintenanceCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200 font-bold border border-amber-500/40">
                {maintenanceCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('stockOpname')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 ${
              activeTab === 'stockOpname'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Stock Opname Fisik</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Tags className="w-4 h-4" />
            <span>Kategori & Lokasi</span>
          </button>

        </div>

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <DashboardView
            state={state}
            onNavigateTab={setActiveTab}
            onQuickInbound={handleQuickInbound}
            onQuickOutbound={handleQuickOutbound}
            onQuickMutasi={handleQuickMutasi}
            onOpenLabelModal={setItemForLabel}
            onOpenReturnLoan={handleOpenReturnLoan}
            onOpenEditItem={handleOpenEditItem}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onOpenPublicForm={(type) => {
              setPublicPortalType(type);
              window.history.pushState({}, '', `?form=${type}`);
            }}
            onAddToast={addToast}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            items={state.items}
            categories={state.categories}
            locations={state.locations}
            onOpenAddItem={handleOpenAddItem}
            onOpenEditItem={handleOpenEditItem}
            onDeleteItem={handleDeleteItem}
            onOpenLabelModal={setItemForLabel}
            onQuickInbound={handleQuickInbound}
            onQuickOutbound={handleQuickOutbound}
          />
        )}

        {activeTab === 'loans' && (
          <LoansView
            loans={state.loans}
            onOpenNewLoan={handleOpenNewLoan}
            onOpenReturnLoan={handleOpenReturnLoan}
            onPrintReceipt={setLoanForReceipt}
            onDeleteLoan={handleDeleteLoan}
          />
        )}

        {activeTab === 'consumables' && (
          <ConsumablesView
            items={state.items}
            requests={state.consumableRequests || []}
            onOpenNewRequest={() => {
              setPublicPortalType('habis-pakai');
              window.history.pushState({}, '', '?form=habis-pakai');
            }}
            onOpenRestock={() => {
              setTxType('IN');
              const bhpList = filterConsumables(state.items);
              setTxPreselectedItem(bhpList[0] || null);
              setIsTxModalOpen(true);
            }}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onPrintSlip={(req) => setRequestForSlip(req)}
          />
        )}

        {activeTab === 'portalLinks' && (
          <PortalLinksView
            items={state.items}
            onOpenPublicForm={(type) => {
              setPublicPortalType(type);
              window.history.pushState({}, '', `?form=${type}`);
            }}
            onAddToast={addToast}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={state.transactions}
            onOpenInbound={() => handleQuickInbound()}
            onOpenOutbound={() => handleQuickOutbound()}
            onOpenMutasi={handleQuickMutasi}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceView
            maintenance={state.maintenance}
            onOpenNewMaintenance={handleOpenNewMaintenance}
            onUpdateStatus={handleUpdateMaintenanceStatus}
            onDeleteMaintenance={handleDeleteMaintenance}
          />
        )}

        {activeTab === 'stockOpname' && (
          <StockOpnameView
            items={state.items}
            onApplyStockOpname={handleApplyStockOpname}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            categories={state.categories}
            locations={state.locations}
            items={state.items}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddLocation={handleAddLocation}
            onDeleteLocation={handleDeleteLocation}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-white/5 py-4 text-xs text-slate-500 text-center no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; MTs Muhammadiyah Metro &bull; Sistem Inventaris Sarpras Madrasah Terintegrasi</span>
          <span className="text-[11px] text-slate-600">Center of Excellence School &bull; Kota Metro, Lampung</span>
        </div>
      </footer>

      {/* Modals Container */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
        categories={state.categories}
        locations={state.locations}
        existingCodes={existingCodes}
      />

      <LoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        onSaveLoan={handleSaveLoan}
        items={state.items}
      />

      <ReturnLoanModal
        isOpen={!!loanToReturn}
        onClose={() => setLoanToReturn(null)}
        loan={loanToReturn}
        onConfirmReturn={handleConfirmReturn}
      />

      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        type={txType}
        items={state.items}
        locations={state.locations}
        preselectedItem={txPreselectedItem}
        onConfirmTransaction={handleConfirmTransaction}
      />

      <MaintenanceModal
        isOpen={isMaintModalOpen}
        onClose={() => setIsMaintModalOpen(false)}
        items={state.items}
        onSaveMaintenance={handleSaveMaintenance}
      />

      <AssetLabelModal
        isOpen={!!itemForLabel}
        onClose={() => setItemForLabel(null)}
        item={itemForLabel}
      />

      <PrintLoanReceiptModal
        isOpen={!!loanForReceipt}
        onClose={() => setLoanForReceipt(null)}
        loan={loanForReceipt}
      />

      <PrintConsumableReceiptModal
        isOpen={!!requestForSlip}
        onClose={() => setRequestForSlip(null)}
        request={requestForSlip}
      />

      <ShareLinksModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenPublicForm={(type) => {
          setIsShareModalOpen(false);
          setPublicPortalType(type);
          window.history.pushState({}, '', `?form=${type}`);
        }}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
}

function prevOrFirst(list: string[]): string {
  return list[0] || '';
}
