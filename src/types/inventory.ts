export type ItemCondition = 'Baik' | 'Kurang Baik' | 'Rusak Berat';

export type FundingSource = 'Dana BOS' | 'Komite Madrasah' | 'Yayasan Muhammadiyah' | 'Hibah / Bantuan' | 'Lainnya';

export type ItemType = 'ASET' | 'HABIS_PAKAI';

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  location: string;
  qty: number;
  minStock: number;
  condition: ItemCondition;
  unit: string; // unit, buah, set, rim, paket, pack, dus, lembar, botol
  pricePerUnit?: number; // Nilai aset per satuan
  fundingSource?: FundingSource;
  purchaseDate?: string;
  desc?: string;
  itemType?: ItemType; // 'ASET' (sarana fisik yang dipinjam-kembalikan) atau 'HABIS_PAKAI' (ATK/BHP)
  lastUpdated: string;
}

export type LoanStatus = 'DIPINJAM' | 'DIKEMBALIKAN' | 'TERLAMBAT';

export interface LoanRecord {
  id: string;
  borrower: string;
  role: 'Guru' | 'Siswa' | 'Staf / Karyawan' | 'Organisasi / IPM' | 'Lainnya';
  contact: string; // Kelas atau No WhatsApp
  itemId: string;
  itemCode: string;
  itemName: string;
  qty: number;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
  purpose: string; // Tujuan kegiatan / pelajaran
  petugas: string;
  conditionOnReturn?: ItemCondition;
  notes?: string;
}

export type ConsumableStatus = 'DISETUJUI' | 'MENUNGGU_PENGAMBILAN' | 'DITOLAK';

export interface ConsumableRequest {
  id: string;
  requestNumber: string;
  applicant: string; // Nama pemohon
  role: 'Guru' | 'Siswa' | 'Staf / Karyawan' | 'Organisasi / IPM' | 'Lainnya';
  unitOrClass: string; // Kelas / Bagian / Mata Pelajaran
  contact: string; // No WhatsApp
  itemId: string;
  itemCode: string;
  itemName: string;
  qty: number;
  unit: string;
  requestDate: string;
  purpose: string; // Keperluan pemakaian habis pakai
  status: ConsumableStatus;
  petugas: string;
  notes?: string;
}

export type TransactionType = 'IN' | 'OUT' | 'MUTASI' | 'AFKIR';

export interface TransactionRecord {
  id: string;
  date: string;
  type: TransactionType;
  itemId: string;
  itemCode: string;
  itemName: string;
  qty: number;
  sourceOrDestination: string; // Misal: Pembelian Dana BOS, Dipakai Acara Milad, Dipindah ke Lab IPA
  petugas: string;
  notes?: string;
}

export type MaintenanceStatus = 'MENUNGGU' | 'DALAM_PENGERJAAN' | 'SELESAI' | 'TIDAK_DAPAT_DIPERBAIKI';

export interface MaintenanceRecord {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  issueDescription: string;
  reportedDate: string;
  completionDate?: string;
  status: MaintenanceStatus;
  cost?: number;
  technician?: string;
  petugas: string;
}

export interface StockOpnameItem {
  itemId: string;
  systemQty: number;
  physicalQty: number;
  difference: number; // physicalQty - systemQty
  condition: ItemCondition;
  notes: string;
}

export interface AppState {
  items: InventoryItem[];
  categories: string[];
  locations: string[];
  loans: LoanRecord[];
  consumableRequests: ConsumableRequest[];
  transactions: TransactionRecord[];
  maintenance: MaintenanceRecord[];
}
