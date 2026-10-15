import * as XLSX from 'xlsx';
import type { AppState, InventoryItem } from '../types/inventory.ts';

export function exportAllToExcel(state: AppState): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Inventaris Barang
  const itemsData = state.items.map((item, idx) => ({
    'No': idx + 1,
    'Kode Barang': item.code,
    'Nama Sarana / Prasarana': item.name,
    'Kategori': item.category,
    'Lokasi / Ruangan': item.location,
    'Jumlah (Qty)': item.qty,
    'Satuan': item.unit,
    'Stok Minimal': item.minStock,
    'Kondisi': item.condition,
    'Harga Satuan (Rp)': item.pricePerUnit || 0,
    'Total Nilai (Rp)': (item.qty || 0) * (item.pricePerUnit || 0),
    'Sumber Dana': item.fundingSource || '-',
    'Tgl Perolehan': item.purchaseDate || '-',
    'Keterangan / Spesifikasi': item.desc || '-'
  }));
  const wsItems = XLSX.utils.json_to_sheet(itemsData);
  XLSX.utils.book_append_sheet(wb, wsItems, 'Inventaris Barang');

  // Sheet 2: Peminjaman
  const loansData = state.loans.map((loan, idx) => ({
    'No': idx + 1,
    'Nama Peminjam': loan.borrower,
    'Peran': loan.role,
    'Kontak / Kelas': loan.contact,
    'Kode Barang': loan.itemCode,
    'Nama Barang': loan.itemName,
    'Jumlah Dipinjam': loan.qty,
    'Tgl Pinjam': loan.borrowDate,
    'Batas Kembali': loan.dueDate,
    'Tgl Dikembalikan': loan.returnDate || '-',
    'Status': loan.status,
    'Keperluan': loan.purpose,
    'Petugas': loan.petugas,
    'Kondisi Saat Kembali': loan.conditionOnReturn || '-'
  }));
  const wsLoans = XLSX.utils.json_to_sheet(loansData);
  XLSX.utils.book_append_sheet(wb, wsLoans, 'Data Peminjaman');

  // Sheet 3: Riwayat Transaksi
  const txData = state.transactions.map((tx, idx) => ({
    'No': idx + 1,
    'Waktu': tx.date,
    'Jenis Transaksi': tx.type,
    'Kode Barang': tx.itemCode,
    'Nama Barang': tx.itemName,
    'Jumlah': tx.qty,
    'Keterangan / Tujuan': tx.sourceOrDestination,
    'Petugas': tx.petugas,
    'Catatan': tx.notes || '-'
  }));
  const wsTx = XLSX.utils.json_to_sheet(txData);
  XLSX.utils.book_append_sheet(wb, wsTx, 'Riwayat Transaksi');

  // Sheet 4: Pemeliharaan
  const maintData = state.maintenance.map((m, idx) => ({
    'No': idx + 1,
    'Kode Barang': m.itemCode,
    'Nama Barang': m.itemName,
    'Keluhan / Kerusakan': m.issueDescription,
    'Tgl Lapor': m.reportedDate,
    'Status': m.status,
    'Estimasi Biaya (Rp)': m.cost || 0,
    'Teknisi / Vendor': m.technician || '-',
    'Petugas Sarpras': m.petugas
  }));
  const wsMaint = XLSX.utils.json_to_sheet(maintData);
  XLSX.utils.book_append_sheet(wb, wsMaint, 'Pemeliharaan');

  // Sheet 5: Permintaan Barang Habis Pakai (BHP)
  const bhpData = (state.consumableRequests || []).map((req, idx) => ({
    'No': idx + 1,
    'No Registrasi': req.requestNumber,
    'Tgl Permintaan': req.requestDate,
    'Nama Pemohon': req.applicant,
    'Peran': req.role,
    'Unit / Kelas': req.unitOrClass,
    'Kontak WA': req.contact,
    'Kode Barang': req.itemCode,
    'Nama Barang Habis Pakai': req.itemName,
    'Jumlah': req.qty,
    'Satuan': req.unit,
    'Keperluan': req.purpose,
    'Status': req.status,
    'Petugas Penyerah': req.petugas
  }));
  const wsBhp = XLSX.utils.json_to_sheet(bhpData);
  XLSX.utils.book_append_sheet(wb, wsBhp, 'Permintaan BHP');

  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Laporan_SARPRAS_MTs_Muhammadiyah_Metro_${today}.xlsx`);
}

export function exportStockOpnameTemplate(items: InventoryItem[]): void {
  const wb = XLSX.utils.book_new();
  const data = items.map((item, idx) => ({
    'No': idx + 1,
    'Kode Barang': item.code,
    'Nama Barang': item.name,
    'Lokasi': item.location,
    'Kategori': item.category,
    'Jumlah di Sistem': item.qty,
    'Jumlah Fisik Riil (Diisi Petugas)': '',
    'Kondisi Riil (Baik / Kurang Baik / Rusak Berat)': item.condition,
    'Catatan Temuan / Selisih': ''
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Lembar Stock Opname');
  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Template_Stock_Opname_Sarpras_${today}.xlsx`);
}

export async function parseExcelItems(file: File): Promise<Partial<InventoryItem>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const wb = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = wb.SheetNames[0];
        const worksheet = wb.Sheets[firstSheetName];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedItems: Partial<InventoryItem>[] = rawJson.map((row: any, i: number) => {
          const code = String(row['Kode Barang'] || row['Kode'] || `SAR-IMP-${Date.now().toString().slice(-4)}${i}`);
          const name = String(row['Nama Sarana / Prasarana'] || row['Nama Barang'] || row['Nama'] || 'Barang Import');
          const category = String(row['Kategori'] || 'Lainnya');
          const location = String(row['Lokasi / Ruangan'] || row['Lokasi'] || 'Gudang Utama Sarpras');
          const qty = parseInt(row['Jumlah (Qty)'] || row['Jumlah'] || row['Qty'] || row['Stok'] || '0') || 0;
          const minStock = parseInt(row['Stok Minimal'] || row['Min Stok'] || '2') || 2;
          const conditionRaw = String(row['Kondisi'] || 'Baik');
          const condition = conditionRaw === 'Kurang Baik' || conditionRaw === 'Rusak Berat' ? conditionRaw : 'Baik';
          const unit = String(row['Satuan'] || 'unit');
          const pricePerUnit = parseInt(row['Harga Satuan (Rp)'] || row['Harga Satuan'] || row['Harga'] || '0') || 0;
          const fundingSource = row['Sumber Dana'] || 'Dana BOS';
          const purchaseDate = row['Tgl Perolehan'] || new Date().toISOString().split('T')[0];
          const desc = row['Keterangan / Spesifikasi'] || row['Keterangan'] || 'Diimpor dari file Excel';

          return {
            code,
            name,
            category,
            location,
            qty,
            minStock,
            condition,
            unit,
            pricePerUnit,
            fundingSource,
            purchaseDate,
            desc
          };
        });

        resolve(parsedItems);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
