/**
 * Resolves the trade discount to apply for a designer / brand pair.
 * Rule: negotiated discount wins if it is strictly greater than the brand default.
 */
export function resolveDiscount(
  brandDefaultDiscount: number,
  negotiatedDiscount?: number,
): number {
  if (negotiatedDiscount !== undefined && negotiatedDiscount > brandDefaultDiscount) {
    return negotiatedDiscount;
  }
  return brandDefaultDiscount;
}

export function applyDiscount(mrp: number, discountPercent: number): number {
  return mrp * (1 - discountPercent / 100);
}
