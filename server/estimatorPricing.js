// Per-project estimator price by building type (NGN).
// Keep in sync with src/constants/toolPricing.ts (ESTIMATOR_PRICE_NGN).
export const ESTIMATOR_PRICE_NGN = {
  bungalow: 399,
  duplex: 599,
  storey_building: 642,
  apartment_block: 979,
  commercial: 979,
}

export const DEFAULT_TOOL_PRICE_NGN = 399

/**
 * Freemium switch. Payments are OFF unless the server env var
 * ESTIMATOR_PAYWALL=on is set (pair it with VITE_ESTIMATOR_PAYWALL=on for the UI).
 * While off, every estimate and PDF is free and users leave their details instead.
 */
export function isEstimatorPaywallEnabled() {
  return String(process.env.ESTIMATOR_PAYWALL || '').trim().toLowerCase() === 'on'
}

export function estimatorPriceFor(buildingType) {
  const key = String(buildingType || '')
  return Object.prototype.hasOwnProperty.call(ESTIMATOR_PRICE_NGN, key)
    ? ESTIMATOR_PRICE_NGN[key]
    : DEFAULT_TOOL_PRICE_NGN
}
