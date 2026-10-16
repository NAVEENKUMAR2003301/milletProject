// Helper functions for multi-variant products.
// A product can have multiple variants (weight + price combinations).

export function getVariants(product) {
  if (!product) return [];
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants;
  }
  // Legacy: single price/weight → wrap as one variant
  if (product.price || product.weight) {
    return [
      {
        id: 'legacy',
        weight: product.weight || '',
        price: product.price || 0,
        mrp: product.mrp || product.price || 0,
        discount: product.discount || 0,
      },
    ];
  }
  return [];
}

export function getLowestPrice(product) {
  const variants = getVariants(product);
  if (!variants.length) return 0;
  return Math.min(...variants.map((v) => v.price || 0));
}

export function hasMultipleVariants(product) {
  return getVariants(product).length > 1;
}

export function makeVariantId() {
  return `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function computeVariantPrice(mrp, discount) {
  const m = Number(mrp) || 0;
  const d = Number(discount) || 0;
  if (m <= 0) return 0;
  if (d <= 0) return m;
  return Math.round(m * (1 - d / 100));
}