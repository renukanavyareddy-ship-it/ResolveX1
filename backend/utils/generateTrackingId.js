/**
 * Generates a unique complaint tracking ID
 * Format: RX-YYYYMM-XXXXX (e.g., RX-202611-48921)
 */
function generateTrackingId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `RX-${year}${month}-${randomNum}`;
}

module.exports = generateTrackingId;
