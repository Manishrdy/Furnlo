/**
 * Splits a flat list of order line items into brand-specific purchase orders.
 */
export interface LineItem {
  id: string;
  brandName: string;
  lineTotal: number;
  [key: string]: unknown;
}

export interface BrandPO {
  brandName: string;
  lineItems: LineItem[];
  subtotal: number;
}

export function splitOrderByBrand(lineItems: LineItem[]): BrandPO[] {
  const groups = new Map<string, LineItem[]>();

  for (const item of lineItems) {
    const existing = groups.get(item.brandName) ?? [];
    existing.push(item);
    groups.set(item.brandName, existing);
  }

  return Array.from(groups.entries()).map(([brandName, items]) => ({
    brandName,
    lineItems: items,
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
  }));
}
