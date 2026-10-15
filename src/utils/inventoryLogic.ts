import type { InventoryItem, LoanRecord, LoanStatus, ConsumableRequest } from '../types/inventory.ts';

export function calculateTotalQuantity(items: InventoryItem[]): number {
  return items.reduce((sum, item) => sum + Math.max(0, Number(item.qty) || 0), 0);
}

export function calculateTotalAssetValue(items: InventoryItem[]): number {
  return items.reduce((sum, item) => {
    const qty = Math.max(0, Number(item.qty) || 0);
    const price = Math.max(0, Number(item.pricePerUnit) || 0);
    return sum + (qty * price);
  }, 0);
}

export function getLowStockItems(items: InventoryItem[]): InventoryItem[] {
  return items.filter(item => {
    const qty = Number(item.qty) || 0;
    const minStock = Number(item.minStock) || 0;
    return qty <= minStock;
  });
}

export function filterFixedAssets(items: InventoryItem[]): InventoryItem[] {
  return items.filter(item => item.itemType !== 'HABIS_PAKAI');
}

export function filterConsumables(items: InventoryItem[]): InventoryItem[] {
  return items.filter(item => item.itemType === 'HABIS_PAKAI');
}

export function evaluateLoanStatus(dueDate: string, returnDate?: string): LoanStatus {
  if (returnDate) return 'DIKEMBALIKAN';
  const today = new Date().toISOString().split('T')[0];
  if (dueDate < today) return 'TERLAMBAT';
  return 'DIPINJAM';
}

export function getOverdueLoans(loans: LoanRecord[], currentDateStr: string): LoanRecord[] {
  return loans.filter(loan => {
    if (loan.status === 'DIKEMBALIKAN') return false;
    return loan.dueDate < currentDateStr;
  });
}

export function calculateStockOpnameDifference(systemQty: number, physicalQty: number): number {
  return (Number(physicalQty) || 0) - (Number(systemQty) || 0);
}

export function generateAssetCode(prefix: string, existingCodes: string[]): string {
  const cleanPrefix = (prefix || 'INV').toUpperCase().trim();
  let counter = 1;
  while (counter < 99999) {
    const padded = String(counter).padStart(4, '0');
    const candidate = `${cleanPrefix}-${padded}`;
    if (!existingCodes.includes(candidate)) {
      return candidate;
    }
    counter++;
  }
  return `${cleanPrefix}-${Date.now().toString().slice(-4)}`;
}

export function generateRequestNumber(prefix: string, existingNumbers: string[]): string {
  const cleanPrefix = (prefix || 'REQ-BHP').toUpperCase().trim();
  const year = new Date().getFullYear();
  let counter = 1;
  while (counter < 9999) {
    const padded = String(counter).padStart(3, '0');
    const candidate = `${cleanPrefix}/${year}/${padded}`;
    if (!existingNumbers.includes(candidate)) {
      return candidate;
    }
    counter++;
  }
  return `${cleanPrefix}/${year}/${Date.now().toString().slice(-4)}`;
}

export function calculateTotalConsumablesDispensed(requests: ConsumableRequest[]): number {
  return requests
    .filter(r => r.status === 'DISETUJUI' || r.status === 'MENUNGGU_PENGAMBILAN')
    .reduce((sum, r) => sum + (Number(r.qty) || 0), 0);
}

export function formatCurrencyIDR(value: number): string {
  if (isNaN(value)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}
