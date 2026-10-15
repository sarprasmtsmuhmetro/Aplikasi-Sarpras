import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTotalQuantity,
  calculateTotalAssetValue,
  getLowStockItems,
  getOverdueLoans,
  calculateStockOpnameDifference,
  generateAssetCode,
  formatCurrencyIDR,
  filterFixedAssets,
  filterConsumables,
  generateRequestNumber,
  calculateTotalConsumablesDispensed
} from './inventoryLogic.ts';
import type { InventoryItem, LoanRecord, ConsumableRequest } from '../types/inventory.ts';

test('calculateTotalQuantity sums all item quantities accurately', () => {
  const items: InventoryItem[] = [
    { id: '1', code: 'A1', name: 'Item 1', category: 'Cat', location: 'Loc', qty: 10, minStock: 2, condition: 'Baik', unit: 'unit', lastUpdated: '2026-10-14' },
    { id: '2', code: 'A2', name: 'Item 2', category: 'Cat', location: 'Loc', qty: 5, minStock: 2, condition: 'Baik', unit: 'unit', lastUpdated: '2026-10-14' },
  ];
  assert.equal(calculateTotalQuantity(items), 15);
});

test('calculateTotalAssetValue calculates sum of qty * pricePerUnit', () => {
  const items: InventoryItem[] = [
    { id: '1', code: 'A1', name: 'Item 1', category: 'Cat', location: 'Loc', qty: 2, pricePerUnit: 5000000, minStock: 2, condition: 'Baik', unit: 'unit', lastUpdated: '2026-10-14' },
    { id: '2', code: 'A2', name: 'Item 2', category: 'Cat', location: 'Loc', qty: 10, pricePerUnit: 150000, minStock: 2, condition: 'Baik', unit: 'unit', lastUpdated: '2026-10-14' },
  ];
  assert.equal(calculateTotalAssetValue(items), 11500000);
});

test('getLowStockItems filters items where qty <= minStock', () => {
  const items: InventoryItem[] = [
    { id: '1', code: 'A1', name: 'Item 1', category: 'Cat', location: 'Loc', qty: 2, minStock: 5, condition: 'Baik', unit: 'unit', lastUpdated: '2026-10-14' },
    { id: '2', code: 'A2', name: 'Item 2', category: 'Cat', location: 'Loc', qty: 10, minStock: 2, condition: 'Baik', unit: 'unit', lastUpdated: '2026-10-14' },
    { id: '3', code: 'A3', name: 'Item 3', category: 'Cat', location: 'Loc', qty: 3, minStock: 3, condition: 'Baik', unit: 'unit', lastUpdated: '2026-10-14' },
  ];
  const low = getLowStockItems(items);
  assert.equal(low.length, 2);
  assert.equal(low[0].id, '1');
  assert.equal(low[1].id, '3');
});

test('filterFixedAssets and filterConsumables separate items by itemType', () => {
  const items: InventoryItem[] = [
    { id: '1', code: 'A1', name: 'Proyektor', category: 'Elektronik', location: 'Lab', qty: 2, minStock: 1, condition: 'Baik', unit: 'unit', itemType: 'ASET', lastUpdated: '2026-10-14' },
    { id: '2', code: 'B1', name: 'Kertas HVS', category: 'ATK', location: 'TU', qty: 50, minStock: 10, condition: 'Baik', unit: 'rim', itemType: 'HABIS_PAKAI', lastUpdated: '2026-10-14' },
    { id: '3', code: 'A2', name: 'Laptop', category: 'Komputer', location: 'Lab', qty: 10, minStock: 2, condition: 'Baik', unit: 'unit', lastUpdated: '2026-10-14' }, // default asset
  ];
  const assets = filterFixedAssets(items);
  const consumables = filterConsumables(items);
  assert.equal(assets.length, 2);
  assert.equal(consumables.length, 1);
  assert.equal(consumables[0].code, 'B1');
});

test('generateRequestNumber creates formatted BHP request ID', () => {
  const existing = ['REQ-BHP/2026/001', 'REQ-BHP/2026/002'];
  const next = generateRequestNumber('REQ-BHP', existing);
  assert.equal(next, 'REQ-BHP/2026/003');
});

test('calculateTotalConsumablesDispensed sums approved consumable requests', () => {
  const requests: ConsumableRequest[] = [
    { id: '1', requestNumber: 'REQ/1', applicant: 'Budi', role: 'Guru', unitOrClass: 'IPA', contact: '081', itemId: 'i1', itemCode: 'B1', itemName: 'Kertas', qty: 5, unit: 'rim', requestDate: '2026-10-14', purpose: 'Ujian', status: 'DISETUJUI', petugas: 'Admin' },
    { id: '2', requestNumber: 'REQ/2', applicant: 'Siti', role: 'Staf / Karyawan', unitOrClass: 'TU', contact: '082', itemId: 'i2', itemCode: 'B2', itemName: 'Spidol', qty: 3, unit: 'buah', requestDate: '2026-10-14', purpose: 'Kelas', status: 'MENUNGGU_PENGAMBILAN', petugas: 'Admin' },
    { id: '3', requestNumber: 'REQ/3', applicant: 'Andi', role: 'Siswa', unitOrClass: 'OSIS', contact: '083', itemId: 'i1', itemCode: 'B1', itemName: 'Kertas', qty: 10, unit: 'rim', requestDate: '2026-10-14', purpose: 'Lomba', status: 'DITOLAK', petugas: 'Admin' },
  ];
  assert.equal(calculateTotalConsumablesDispensed(requests), 8);
});

test('getOverdueLoans identifies active loans past due date', () => {
  const loans: LoanRecord[] = [
    { id: 'l1', borrower: 'Budi', role: 'Guru', contact: '081', itemId: '1', itemCode: 'A1', itemName: 'P', qty: 1, borrowDate: '2026-10-01', dueDate: '2026-10-05', status: 'DIPINJAM', purpose: 'Mengajar', petugas: 'Admin' },
    { id: 'l2', borrower: 'Siti', role: 'Siswa', contact: '082', itemId: '1', itemCode: 'A1', itemName: 'P', qty: 1, borrowDate: '2026-10-10', dueDate: '2026-10-20', status: 'DIPINJAM', purpose: 'Pentas', petugas: 'Admin' },
    { id: 'l3', borrower: 'Andi', role: 'Guru', contact: '083', itemId: '1', itemCode: 'A1', itemName: 'P', qty: 1, borrowDate: '2026-10-01', dueDate: '2026-10-05', status: 'DIKEMBALIKAN', returnDate: '2026-10-04', purpose: 'Ujian', petugas: 'Admin' },
  ];
  const overdue = getOverdueLoans(loans, '2026-10-14');
  assert.equal(overdue.length, 1);
  assert.equal(overdue[0].id, 'l1');
});

test('calculateStockOpnameDifference calculates physical minus system count', () => {
  assert.equal(calculateStockOpnameDifference(10, 8), -2);
  assert.equal(calculateStockOpnameDifference(10, 12), 2);
  assert.equal(calculateStockOpnameDifference(5, 5), 0);
});

test('generateAssetCode produces unique formatted code', () => {
  const existing = ['INV-0001', 'INV-0002'];
  const code = generateAssetCode('INV', existing);
  assert.equal(code, 'INV-0003');
});

test('formatCurrencyIDR formats Indonesian Rupiah nicely', () => {
  const formatted = formatCurrencyIDR(1500000);
  assert.ok(formatted.includes('1.500.000'));
});
