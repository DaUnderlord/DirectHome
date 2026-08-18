import type { ConstructionEstimate, QualityComparison } from '../../types/construction';
import { formatNaira } from '../../utils/naira';
import {
  BUILDING_LABELS,
  CATEGORY_LABELS,
  QUALITY_LABELS,
  ROOFING_LABELS,
} from './estimatorCopy';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildEstimateHtml(
  estimate: ConstructionEstimate,
  comparisons: QualityComparison[]
): string {
  const { specs } = estimate;

  const materialRows = estimate.materialCosts
    .map(
      (item) =>
        `<tr><td>${esc(item.description)}</td><td>${item.quantity} ${esc(item.unit)}</td><td>${formatNaira(item.unitCost)}</td><td>${formatNaira(item.totalCost)}</td></tr>`
    )
    .join('');

  const laborRows = estimate.laborCosts
    .map(
      (item) =>
        `<tr><td>${esc(item.category)}</td><td>${esc(item.description)}</td><td>${Math.ceil(item.estimatedDays)}</td><td>${formatNaira(item.totalCost)}</td></tr>`
    )
    .join('');

  const addonRows = estimate.addonCosts.length
    ? estimate.addonCosts
        .map(
          (item) =>
            `<tr><td>${esc(item.description)}</td><td>${formatNaira(item.totalCost)}</td></tr>`
        )
        .join('')
    : '<tr><td colspan="2">None selected</td></tr>';

  const stageRows = estimate.stages
    .map(
      (stage) =>
        `<tr><td>${esc(stage.label)}</td><td>${formatNaira(stage.materials)}</td><td>${formatNaira(stage.labor)}</td><td>${formatNaira(stage.total)}</td></tr>`
    )
    .join('');

  const cashRows = estimate.cashPlan
    .map(
      (phase) =>
        `<tr><td>${esc(phase.label)}</td><td>${esc(phase.window)}</td><td>${formatNaira(phase.amount)}</td></tr>`
    )
    .join('');

  const compareRows = comparisons
    .map(
      (item) =>
        `<tr><td>${QUALITY_LABELS[item.quality]}</td><td>${formatNaira(item.grandTotal)}</td><td>${formatNaira(item.costPerSquareMeter)}/sqm</td><td>${item.months} months</td></tr>`
    )
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>DirectHome construction estimate</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; color: #1C1916; background: #F3EEE4; margin: 0; padding: 32px; }
    h1 { font-size: 28px; margin: 0 0 4px; }
    h2 { font-size: 16px; letter-spacing: 0.12em; text-transform: uppercase; color: #1F4A3E; margin: 28px 0 10px; }
    p, td, th, li { font-family: Figtree, Calibri, sans-serif; font-size: 13px; }
    .kicker { letter-spacing: 0.28em; text-transform: uppercase; color: #1F4A3E; font-size: 11px; font-weight: 600; }
    .total { font-size: 26px; margin: 8px 0 0; }
    table { width: 100%; border-collapse: collapse; background: #FFFcf8; }
    th, td { border-bottom: 1px solid #E8E0D2; padding: 8px 10px; text-align: left; }
    th { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #5C534C; }
    td:last-child, th:last-child { text-align: right; }
    .note { color: #5C534C; font-size: 12px; margin-top: 24px; }
    @media print { body { padding: 12px; } }
  </style>
</head>
<body>
  <p class="kicker">DirectHome · Construction estimate</p>
  <h1>${esc(BUILDING_LABELS[specs.buildingType])} · ${specs.totalSquareMeters} sqm</h1>
  <p>${esc(specs.location.city)} · ${specs.numberOfBedrooms} bed · ${specs.numberOfBathrooms} bath · ${specs.numberOfFloors} floor${specs.numberOfFloors === 1 ? '' : 's'} · ${QUALITY_LABELS[specs.finishingQuality]} · ${ROOFING_LABELS[specs.roofing]}</p>
  <p class="total">${formatNaira(estimate.grandTotal)}</p>
  <p>${formatNaira(estimate.costPerSquareMeter)} per sqm · ${estimate.estimatedDuration.months} months</p>

  <h2>Build in stages</h2>
  <table>
    <thead><tr><th>Stage</th><th>Materials</th><th>Labour</th><th>Total</th></tr></thead>
    <tbody>${stageRows}</tbody>
  </table>

  <h2>Cash calendar</h2>
  <table>
    <thead><tr><th>Phase</th><th>Window</th><th>Amount</th></tr></thead>
    <tbody>${cashRows}</tbody>
  </table>

  <h2>Finishing comparison</h2>
  <table>
    <thead><tr><th>Quality</th><th>Total</th><th>Rate</th><th>Duration</th></tr></thead>
    <tbody>${compareRows}</tbody>
  </table>

  <h2>Bill of quantities</h2>
  <table>
    <thead><tr><th>Item</th><th>Qty</th><th>Unit cost</th><th>Total</th></tr></thead>
    <tbody>${materialRows}</tbody>
  </table>

  <h2>Site extras</h2>
  <table>
    <thead><tr><th>Item</th><th>Total</th></tr></thead>
    <tbody>${addonRows}</tbody>
  </table>

  <h2>Labour</h2>
  <table>
    <thead><tr><th>Trade</th><th>Scope</th><th>Days</th><th>Total</th></tr></thead>
    <tbody>${laborRows}</tbody>
  </table>

  <h2>Fees and approvals</h2>
  <table>
    <tbody>
      <tr><td>Architect</td><td>${formatNaira(estimate.professionalFees.architect)}</td></tr>
      ${estimate.professionalFees.structuralEngineer ? `<tr><td>Structural engineer</td><td>${formatNaira(estimate.professionalFees.structuralEngineer)}</td></tr>` : ''}
      <tr><td>Electrical engineer</td><td>${formatNaira(estimate.professionalFees.electricalEngineer)}</td></tr>
      ${estimate.professionalFees.mechanicalEngineer ? `<tr><td>Mechanical engineer</td><td>${formatNaira(estimate.professionalFees.mechanicalEngineer)}</td></tr>` : ''}
      <tr><td>Project manager</td><td>${formatNaira(estimate.professionalFees.projectManager)}</td></tr>
      <tr><td>Building permit</td><td>${formatNaira(estimate.permits.buildingPermit)}</td></tr>
      <tr><td>Environmental approval</td><td>${formatNaira(estimate.permits.environmentalApproval)}</td></tr>
      <tr><td>Utility connections</td><td>${formatNaira(estimate.permits.utilityConnections)}</td></tr>
      <tr><td>Contingency</td><td>${formatNaira(estimate.breakdown.contingency)}</td></tr>
      <tr><td>VAT 7.5%</td><td>${formatNaira(estimate.vat)}</td></tr>
    </tbody>
  </table>

  <p class="note">DirectHome estimate for planning only. Unit rates are DirectHome’s client-reviewed Nigerian market rates as of August 2026. Actual costs vary by site, contractor, and availability. Get multiple quotes from licensed contractors before you commit. This is not a tender or a construction contract.</p>
</body>
</html>`;
}

function downloadEstimateHtml(html: string, specs: ConstructionEstimate['specs']): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `directhome-estimate-${specs.location.city.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.html`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function printHtmlInFrame(html: string): boolean {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.position = 'fixed';
  frame.style.right = '0';
  frame.style.bottom = '0';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.style.border = '0';
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win) {
    frame.remove();
    return false;
  }

  doc.open();
  doc.write(html);
  doc.close();

  const cleanup = () => {
    window.setTimeout(() => frame.remove(), 500);
  };

  win.onafterprint = cleanup;
  window.setTimeout(() => {
    win.focus();
    win.print();
    window.setTimeout(cleanup, 15000);
  }, 300);

  return true;
}

function printHtmlInTab(html: string): boolean {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const tab = window.open(url, '_blank');
  if (!tab) {
    URL.revokeObjectURL(url);
    return false;
  }

  tab.onload = () => {
    tab.focus();
    tab.print();
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return true;
}

export function printEstimateReport(
  estimate: ConstructionEstimate,
  comparisons: QualityComparison[]
): void {
  const html = buildEstimateHtml(estimate, comparisons);

  if (printHtmlInFrame(html)) return;

  if (printHtmlInTab(html)) return;

  downloadEstimateHtml(html, estimate.specs);
  window.alert(
    'Your browser blocked the print window. We downloaded an HTML report instead — open it and choose Print → Save as PDF.'
  );
}
