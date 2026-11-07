const PRODUCT_BASE_RATES = {
  'solid-fom': 4500,
  'liquid-slurry': 4800,
  'vermigold-blend': 5800,
  'corn-ddgs-bulk': 24000,
  'rice-ddgs-bulk': 22500,
  'heavy-cane-molasses': 11500,
  'sbt-supercritical-seed-oil': 18000,
  'sbt-berry-pulp-oil': 16500,
  'sbt-freeze-dried-powder': 12000,
};

export function calculateQuote({ product, volume, pincode }) {
  const tons = Number(volume);
  
  let basePricePerTon = PRODUCT_BASE_RATES[product] || PRODUCT_BASE_RATES['solid-fom'];

  // Apply volume discount
  if (tons >= 50 && tons < 150) {
    basePricePerTon = Math.round(basePricePerTon * 0.96);
  } else if (tons >= 150) {
    basePricePerTon = Math.round(basePricePerTon * 0.92);
  }
  
  // Freight calculation based on pincode seed and tonnage
  const pincodeFactor = Number(String(pincode).slice(-2)) || 25;
  const baseFreightPerTon = 650 + (pincodeFactor % 15) * 20;
  const freightCost = Math.round(tons * baseFreightPerTon);
  
  const manureCost = Math.round(tons * basePricePerTon);
  const total = manureCost + freightCost;
  const pricePerTon = Math.round(total / tons);

  return {
    manureCost,
    freightCost,
    total,
    pricePerTon,
    isEstimated: true,
  };
}
