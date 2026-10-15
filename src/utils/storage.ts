import type { AppState, InventoryItem, LoanRecord, TransactionRecord, MaintenanceRecord, ConsumableRequest } from '../types/inventory.ts';

const STORAGE_KEY = 'sarpras_madtsamu_v2';

export const INITIAL_DATA: AppState = {
  items: [
    {
      id: 'item-1',
      code: 'SAR-EL-0001',
      name: 'Proyektor Epson EB-X450',
      category: 'Elektronik & Multimedia',
      location: 'Ruang Multimedia / Smart Class',
      qty: 5,
      minStock: 2,
      condition: 'Baik',
      unit: 'unit',
      pricePerUnit: 6200000,
      fundingSource: 'Dana BOS',
      purchaseDate: '2024-03-15',
      itemType: 'ASET',
      desc: 'Lengkap dengan kabel HDMI 15m, remote, dan tas pembungkus',
      lastUpdated: '2026-10-14'
    },
    {
      id: 'item-2',
      code: 'SAR-LAB-0002',
      name: 'Chromebook ASUS Flip C214',
      category: 'Peralatan Lab IPA & Komputer',
      location: 'Lab Komputer 1',
      qty: 32,
      minStock: 5,
      condition: 'Baik',
      unit: 'unit',
      pricePerUnit: 4800000,
      fundingSource: 'Dana BOS',
      purchaseDate: '2023-08-20',
      itemType: 'ASET',
      desc: 'Touchscreen + Stylus, inventaris utama lab CBT & ANBK',
      lastUpdated: '2026-10-14'
    },
    {
      id: 'item-3',
      code: 'SAR-LAB-0003',
      name: 'Mikroskop Binokuler Siswa XSZ-107BN',
      category: 'Peralatan Lab IPA & Komputer',
      location: 'Lab IPA',
      qty: 12,
      minStock: 3,
      condition: 'Baik',
      unit: 'unit',
      pricePerUnit: 3500000,
      fundingSource: 'Komite Madrasah',
      purchaseDate: '2023-11-10',
      itemType: 'ASET',
      desc: 'Perbesaran 1600x, dilengkapi lampu LED dan kaca preparat',
      lastUpdated: '2026-10-14'
    },
    {
      id: 'item-4',
      code: 'SAR-MEB-0004',
      name: 'Meja Siswa Kayu Mahoni Standar SNI',
      category: 'Mebelair & Meja Kursi',
      location: 'Gudang Utama Sarpras',
      qty: 38,
      minStock: 10,
      condition: 'Baik',
      unit: 'buah',
      pricePerUnit: 380000,
      fundingSource: 'Yayasan Muhammadiyah',
      purchaseDate: '2024-01-12',
      itemType: 'ASET',
      desc: 'Stok cadangan untuk pergantian kelas VII-IX',
      lastUpdated: '2026-10-14'
    },
    {
      id: 'item-5',
      code: 'SAR-MEB-0005',
      name: 'Kursi Lipat Pipa Besi Chitose',
      category: 'Mebelair & Meja Kursi',
      location: 'Aula Ahmad Dahlan',
      qty: 120,
      minStock: 25,
      condition: 'Kurang Baik',
      unit: 'buah',
      pricePerUnit: 225000,
      fundingSource: 'Komite Madrasah',
      purchaseDate: '2022-06-18',
      itemType: 'ASET',
      desc: 'Sebagian bantalan busa mulai kendor & butuh pengencangan baut',
      lastUpdated: '2026-10-14'
    },
    {
      id: 'item-6',
      code: 'SAR-EL-0006',
      name: 'Speaker Portable Wireless Baretone 15 Inch',
      category: 'Elektronik & Multimedia',
      location: 'Aula Ahmad Dahlan',
      qty: 2,
      minStock: 1,
      condition: 'Baik',
      unit: 'set',
      pricePerUnit: 3850000,
      fundingSource: 'Dana BOS',
      purchaseDate: '2024-05-02',
      itemType: 'ASET',
      desc: 'Termasuk 2 mikrofon wireless UHF dan stand tripod',
      lastUpdated: '2026-10-14'
    },
    {
      id: 'item-7',
      code: 'SAR-OLR-0007',
      name: 'Bola Voli Molten V5M5000',
      category: 'Sarana Olahraga & Seni',
      location: 'Gudang Utama Sarpras',
      qty: 3,
      minStock: 5,
      condition: 'Baik',
      unit: 'buah',
      pricePerUnit: 480000,
      fundingSource: 'Dana BOS',
      purchaseDate: '2024-02-14',
      itemType: 'ASET',
      desc: 'Standar PBVSI resmi madrasah (stok menipis, butuh restock)',
      lastUpdated: '2026-10-14'
    },
    {
      id: 'item-8',
      code: 'SAR-EL-0008',
      name: 'AC Daikin Standard 1.5 PK',
      category: 'Elektronik & Multimedia',
      location: 'Lab Komputer 1',
      qty: 2,
      minStock: 1,
      condition: 'Kurang Baik',
      unit: 'unit',
      pricePerUnit: 5200000,
      fundingSource: 'Komite Madrasah',
      purchaseDate: '2022-09-01',
      itemType: 'ASET',
      desc: '1 unit hembusan udara kurang dingin, dalam antrian servis berkala',
      lastUpdated: '2026-10-14'
    },
    // --- Seed Barang Habis Pakai (BHP) ---
    {
      id: 'item-bhp-1',
      code: 'BHP-ATK-0001',
      name: 'Kertas HVS SiDU A4 75 GSM',
      category: 'Alat Tulis Kantor (ATK / BHP)',
      location: 'Gudang Utama Sarpras',
      qty: 48,
      minStock: 10,
      condition: 'Baik',
      unit: 'rim',
      pricePerUnit: 54000,
      fundingSource: 'Dana BOS',
      purchaseDate: '2024-09-01',
      itemType: 'HABIS_PAKAI',
      desc: 'Kertas putih bersih untuk penggandaan materi, ujian madrasah & TU',
      lastUpdated: '2026-10-14'
    },
    {
      id: 'item-bhp-2',
      code: 'BHP-ATK-0002',
      name: 'Spidol Whiteboard Snowman BG-12 Hitam',
      category: 'Alat Tulis Kantor (ATK / BHP)',
      location: 'Ruang Guru & Tata Usaha',
      qty: 36,
      minStock: 12,
      condition: 'Baik',
      unit: 'buah',
      pricePerUnit: 9500,
      fundingSource: 'Dana BOS',
      purchaseDate: '2024-09-15',
      itemType: 'HABIS_PAKAI',
      desc: 'Tinta pekat mudah dihapus, untuk kegiatan KBM kelas VII-IX',
      lastUpdated: '2026-10-14'
    },
    {
      id: 'item-bhp-3',
      code: 'BHP-EL-0003',
      name: 'Baterai Alkaline ABC AA (Isi 2 Pcs)',
      category: 'Alat Tulis Kantor (ATK / BHP)',
      location: 'Ruang Multimedia / Smart Class',
      qty: 20,
      minStock: 8,
      condition: 'Baik',
      unit: 'pack',
      pricePerUnit: 18500,
      fundingSource: 'Dana BOS',
      purchaseDate: '2024-08-10',
      itemType: 'HABIS_PAKAI',
      desc: 'Daya tahan tinggi khusus mic wireless aula & masjid madrasah',
      lastUpdated: '2026-10-14'
    },
    {
      id: 'item-bhp-4',
      code: 'BHP-LAB-0004',
      name: 'Tinta Printer Epson 003 Black Original',
      category: 'Alat Tulis Kantor (ATK / BHP)',
      location: 'Lab Komputer 1',
      qty: 8,
      minStock: 3,
      condition: 'Baik',
      unit: 'botol',
      pricePerUnit: 92000,
      fundingSource: 'Dana BOS',
      purchaseDate: '2024-09-20',
      itemType: 'HABIS_PAKAI',
      desc: 'Tinta original Epson seri L3110 / L3210 untuk cetak administrasi',
      lastUpdated: '2026-10-14'
    },
    {
      id: 'item-bhp-5',
      code: 'BHP-ATK-0005',
      name: 'Map Snelhecter Kancing Plastik Folio',
      category: 'Alat Tulis Kantor (ATK / BHP)',
      location: 'Ruang Guru & Tata Usaha',
      qty: 85,
      minStock: 25,
      condition: 'Baik',
      unit: 'buah',
      pricePerUnit: 3500,
      fundingSource: 'Dana BOS',
      purchaseDate: '2024-07-28',
      itemType: 'HABIS_PAKAI',
      desc: 'Pemberkasan raport & arsip ijazah kelulusan siswa',
      lastUpdated: '2026-10-14'
    }
  ],
  categories: [
    'Elektronik & Multimedia',
    'Mebelair & Meja Kursi',
    'Peralatan Lab IPA & Komputer',
    'Alat Tulis Kantor (ATK / BHP)',
    'Sarana Olahraga & Seni',
    'Alat Kebersihan & K3',
    'Buku & Modul Perpustakaan'
  ],
  locations: [
    'Ruang Multimedia / Smart Class',
    'Lab Komputer 1',
    'Lab IPA',
    'Aula Ahmad Dahlan',
    'Ruang Guru & Tata Usaha',
    'Gudang Utama Sarpras',
    'Perpustakaan K.H. Mas Mansyur',
    'Lapangan Olahraga Madrasah'
  ],
  loans: [
    {
      id: 'loan-1',
      borrower: 'Ustadz Ahmad Fauzi, M.Pd',
      role: 'Guru',
      contact: '0812-7890-1234 (Guru PAI)',
      itemId: 'item-1',
      itemCode: 'SAR-EL-0001',
      itemName: 'Proyektor Epson EB-X450',
      qty: 1,
      borrowDate: '2026-10-14',
      dueDate: '2026-10-16',
      status: 'DIPINJAM',
      purpose: 'Presentasi materi fiqih & video pembelajaran di Smart Class',
      petugas: 'M. Rizqi (Staf Sarpras)'
    },
    {
      id: 'loan-2',
      borrower: 'Pimpinan Ranting IPM MTsM Metro',
      role: 'Organisasi / IPM',
      contact: '0857-8901-2345 (Ketua IPM)',
      itemId: 'item-6',
      itemCode: 'SAR-EL-0006',
      itemName: 'Speaker Portable Wireless Baretone 15 Inch',
      qty: 1,
      borrowDate: '2026-10-10',
      dueDate: '2026-10-12',
      status: 'TERLAMBAT',
      purpose: 'Kajian Rutin Keputrian & Pelatihan Da\'i Muda di Masjid',
      petugas: 'Siti Aminah, A.Md'
    },
    {
      id: 'loan-3',
      borrower: 'Nurul Hidayati, S.Kom',
      role: 'Guru',
      contact: '0821-6543-9876 (Kepala Lab Komputer)',
      itemId: 'item-2',
      itemCode: 'SAR-LAB-0002',
      itemName: 'Chromebook ASUS Flip C214',
      qty: 8,
      borrowDate: '2026-10-05',
      dueDate: '2026-10-07',
      returnDate: '2026-10-07',
      status: 'DIKEMBALIKAN',
      conditionOnReturn: 'Baik',
      purpose: 'Simulasi Lomba Kompetensi Sains Madrasah (KSM)',
      petugas: 'M. Rizqi (Staf Sarpras)',
      notes: 'Semua unit telah diperiksa, adaptor lengkap dan baterai normal'
    }
  ],
  consumableRequests: [
    {
      id: 'bhp-req-1',
      requestNumber: 'REQ-BHP/2026/001',
      applicant: 'Ustadzah Siti Fatimah, S.Pd',
      role: 'Guru',
      unitOrClass: 'Mata Pelajaran Matematika (Kelas VII & VIII)',
      contact: '0813-9876-5432',
      itemId: 'item-bhp-1',
      itemCode: 'BHP-ATK-0001',
      itemName: 'Kertas HVS SiDU A4 75 GSM',
      qty: 2,
      unit: 'rim',
      requestDate: '2026-10-14',
      purpose: 'Penggandaan Lembar Soal Ujian Tengah Semester & Modul Ajar',
      status: 'DISETUJUI',
      petugas: 'M. Rizqi (Staf Sarpras)',
      notes: 'Telah diserahkan 2 rim dari Gudang Utama'
    },
    {
      id: 'bhp-req-2',
      requestNumber: 'REQ-BHP/2026/002',
      applicant: 'Panitia Milad Muhammadiyah MTsM',
      role: 'Organisasi / IPM',
      unitOrClass: 'Seksi Acara & Perlombaan',
      contact: '0858-1122-3344',
      itemId: 'item-bhp-3',
      itemCode: 'BHP-EL-0003',
      itemName: 'Baterai Alkaline ABC AA (Isi 2 Pcs)',
      qty: 4,
      unit: 'pack',
      requestDate: '2026-10-14',
      purpose: 'Kebutuhan mikrofon nirkabel panggung pembukaan Milad di Aula',
      status: 'DISETUJUI',
      petugas: 'Bambang Irawan',
      notes: 'Baterai baru segel pabrik'
    }
  ],
  transactions: [
    {
      id: 'tx-1',
      date: '2026-10-14 08:30',
      type: 'IN',
      itemId: 'item-1',
      itemCode: 'SAR-EL-0001',
      itemName: 'Proyektor Epson EB-X450',
      qty: 2,
      sourceOrDestination: 'Pengadaan Sarpras Anggaran BOS Tahap II',
      petugas: 'M. Rizqi (Staf Sarpras)',
      notes: 'Kondisi gres baru, segel utuh'
    },
    {
      id: 'tx-2',
      date: '2026-10-14 10:15',
      type: 'OUT',
      itemId: 'item-1',
      itemCode: 'SAR-EL-0001',
      itemName: 'Proyektor Epson EB-X450',
      qty: 1,
      sourceOrDestination: 'Dipinjam Ustadz Ahmad Fauzi, M.Pd (Kelas IX A)',
      petugas: 'M. Rizqi (Staf Sarpras)',
      notes: 'Kabel dan remote lengkap'
    },
    {
      id: 'tx-3',
      date: '2026-10-13 14:00',
      type: 'MUTASI',
      itemId: 'item-5',
      itemCode: 'SAR-MEB-0005',
      itemName: 'Kursi Lipat Pipa Besi Chitose',
      qty: 20,
      sourceOrDestination: 'Dari Gudang Utama dipindah ke Aula Ahmad Dahlan',
      petugas: 'Bambang Irawan (Kebersihan & Sarpras)',
      notes: 'Penambahan kapasitas untuk rapat wali murid'
    },
    {
      id: 'tx-4',
      date: '2026-10-14 11:00',
      type: 'OUT',
      itemId: 'item-bhp-1',
      itemCode: 'BHP-ATK-0001',
      itemName: 'Kertas HVS SiDU A4 75 GSM',
      qty: 2,
      sourceOrDestination: 'Permintaan BHP: Ustadzah Siti Fatimah, S.Pd',
      petugas: 'M. Rizqi (Staf Sarpras)',
      notes: 'Keperluan Ujian Sumatif Matematika'
    }
  ],
  maintenance: [
    {
      id: 'm-1',
      itemId: 'item-8',
      itemCode: 'SAR-EL-0008',
      itemName: 'AC Daikin Standard 1.5 PK',
      issueDescription: 'Hembusan udara tidak dingin, butuh pencucian indoor-outdoor & penambahan freon R32',
      reportedDate: '2026-10-11',
      status: 'DALAM_PENGERJAAN',
      cost: 350000,
      technician: 'CV Metro AC Sejuk Mandiri',
      petugas: 'M. Rizqi (Staf Sarpras)'
    },
    {
      id: 'm-2',
      itemId: 'item-5',
      itemCode: 'SAR-MEB-0005',
      itemName: 'Kursi Lipat Pipa Besi Chitose',
      issueDescription: '4 unit baut lipatan terlepas dan bantalan kulit sintetis sobek',
      reportedDate: '2026-10-12',
      status: 'MENUNGGU',
      cost: 150000,
      technician: 'Bengkel Las & Mebel Barokah Metro',
      petugas: 'Bambang Irawan'
    }
  ]
};

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveAppState(INITIAL_DATA);
      return INITIAL_DATA;
    }
    const parsed = JSON.parse(raw);
    return {
      items: parsed.items || INITIAL_DATA.items,
      categories: parsed.categories || INITIAL_DATA.categories,
      locations: parsed.locations || INITIAL_DATA.locations,
      loans: parsed.loans || INITIAL_DATA.loans,
      consumableRequests: parsed.consumableRequests || INITIAL_DATA.consumableRequests,
      transactions: parsed.transactions || INITIAL_DATA.transactions,
      maintenance: parsed.maintenance || INITIAL_DATA.maintenance
    };
  } catch (e) {
    console.error('Failed to load storage, using default initial data', e);
    return INITIAL_DATA;
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to persist state to localStorage', e);
  }
}
