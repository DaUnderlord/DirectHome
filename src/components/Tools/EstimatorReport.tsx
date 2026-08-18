import React, { useMemo } from 'react';
import { IconDownload } from '@tabler/icons-react';
import type { ConstructionEstimate, QualityComparison } from '../../types/construction';
import { formatNaira } from '../../utils/naira';
import { printEstimateReport } from './estimatorPrint';
import {
  BREAKDOWN_BAR,
  BUILDING_LABELS,
  CATEGORY_LABELS,
  QUALITY_LABELS,
  ROOFING_LABELS,
} from './estimatorCopy';

interface EstimatorReportProps {
  estimate: ConstructionEstimate;
  comparisons: QualityComparison[];
}

const EstimatorReport: React.FC<EstimatorReportProps> = ({
  estimate,
  comparisons,
}) => {
  const { specs } = estimate;

  const groupedMaterials = useMemo(() => {
    const groups = new Map<string, typeof estimate.materialCosts>();
    estimate.materialCosts.forEach((item) => {
      const key = item.category || 'other';
      const list = groups.get(key) || [];
      list.push(item);
      groups.set(key, list);
    });
    return Array.from(groups.entries());
  }, [estimate]);

  const mix = [
    { label: 'Materials', amount: estimate.breakdown.materials },
    { label: 'Labour', amount: estimate.breakdown.labor },
    { label: 'Professional fees', amount: estimate.breakdown.professional },
    { label: 'Permits & approvals', amount: estimate.breakdown.permits },
    ...(estimate.breakdown.addons > 0
      ? [{ label: 'Site extras', amount: estimate.breakdown.addons }]
      : []),
    { label: 'Contingency', amount: estimate.breakdown.contingency },
    { label: 'VAT (7.5%)', amount: estimate.vat },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold">
          {BUILDING_LABELS[specs.buildingType]} · {specs.location.city}
        </p>
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink-950 mt-1">
          {formatNaira(estimate.grandTotal)}
        </h3>
        <p className="text-ink-600 mt-2">
          {specs.totalSquareMeters} sqm · {specs.numberOfBedrooms} bed · {specs.numberOfBathrooms}{' '}
          bath · {specs.numberOfFloors} floor{specs.numberOfFloors === 1 ? '' : 's'} ·{' '}
          {QUALITY_LABELS[specs.finishingQuality]} · {ROOFING_LABELS[specs.roofing]}
        </p>
        <p className="text-sm text-ink-600 mt-1">
          {formatNaira(estimate.costPerSquareMeter)} per sqm · {estimate.estimatedDuration.months}{' '}
          months
        </p>
      </div>

      <div>
        <h4 className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold mb-3">
          Finishing comparison
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {comparisons.map((item) => {
            const active = item.quality === specs.finishingQuality;
            return (
              <div
                key={item.quality}
                className={`border p-4 ${
                  active ? 'border-courtyard-700 bg-courtyard-50' : 'border-paper-200 bg-paper-50'
                }`}
              >
                <p className="text-sm font-semibold text-ink-950">{QUALITY_LABELS[item.quality]}</p>
                <p className="font-display text-xl font-semibold text-ink-950 mt-1">
                  {formatNaira(item.grandTotal)}
                </p>
                <p className="text-xs text-ink-600 mt-1">
                  {formatNaira(item.costPerSquareMeter)}/sqm · {item.months} mo
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold mb-3">
          Where the money goes
        </h4>
        <div className="space-y-3">
          {mix.map((item) => {
            const percentage = (item.amount / estimate.grandTotal) * 100;
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink-600">{item.label}</span>
                  <span className="font-semibold text-ink-950">
                    {formatNaira(item.amount)} · {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-paper-200 h-1.5">
                  <div
                    className={`${BREAKDOWN_BAR[item.label] || 'bg-courtyard-700'} h-1.5`}
                    style={{ width: `${Math.max(percentage, 1)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {estimate.stages
              .filter((stage) => stage.total > 0)
              .map((stage) => (
                <div key={stage.id} className="border border-paper-200 bg-paper-50 p-4">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-courtyard-700 font-semibold">
                    {stage.label}
                  </p>
                  <p className="font-display text-2xl font-semibold text-ink-950 mt-1">
                    {formatNaira(stage.total)}
                  </p>
                  <p className="text-xs text-ink-600 mt-1">
                    {stage.id === 'extras'
                      ? 'Pool, BQ, garage, fence, and other site items'
                      : `Materials ${formatNaira(stage.materials)} · Labour ${formatNaira(stage.labor)}`}
                  </p>
                </div>
              ))}
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold mb-3">
              Cash calendar
            </h4>
            <div className="border border-paper-200 divide-y divide-paper-200">
              {estimate.cashPlan.map((phase) => (
                <div
                  key={phase.label}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3 bg-paper-50"
                >
                  <div>
                    <p className="font-semibold text-ink-950">{phase.label}</p>
                    <p className="text-sm text-ink-600">{phase.window}</p>
                  </div>
                  <p className="font-semibold text-ink-950">{formatNaira(phase.amount)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold mb-3">
              Bill of quantities
            </h4>
            <div className="space-y-6">
              {groupedMaterials.map(([category, items]) => (
                <div key={category}>
                  <p className="text-sm font-semibold text-ink-800 mb-2">
                    {CATEGORY_LABELS[category] || category}
                  </p>
                  <div className="overflow-x-auto border border-paper-200">
                    <table className="min-w-full">
                      <thead className="bg-paper-100">
                        <tr>
                          <th className="px-3 py-2 text-left text-[11px] uppercase tracking-wide text-ink-600">
                            Item
                          </th>
                          <th className="px-3 py-2 text-right text-[11px] uppercase tracking-wide text-ink-600">
                            Qty
                          </th>
                          <th className="px-3 py-2 text-right text-[11px] uppercase tracking-wide text-ink-600">
                            Unit
                          </th>
                          <th className="px-3 py-2 text-right text-[11px] uppercase tracking-wide text-ink-600">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.description} className="border-t border-paper-200">
                            <td className="px-3 py-2 text-sm text-ink-800">{item.description}</td>
                            <td className="px-3 py-2 text-sm text-ink-600 text-right">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="px-3 py-2 text-sm text-ink-600 text-right">
                              {formatNaira(item.unitCost)}
                            </td>
                            <td className="px-3 py-2 text-sm font-medium text-ink-950 text-right">
                              {formatNaira(item.totalCost)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {estimate.addonCosts.length > 0 && (
            <div>
              <h4 className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold mb-3">
                Site extras
              </h4>
              <div className="border border-paper-200 divide-y divide-paper-200">
                {estimate.addonCosts.map((item) => (
                  <div key={item.description} className="flex justify-between px-4 py-3">
                    <span className="text-ink-700">{item.description}</span>
                    <span className="font-semibold text-ink-950">{formatNaira(item.totalCost)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold mb-3">
              Labour
            </h4>
            <div className="overflow-x-auto border border-paper-200">
              <table className="min-w-full">
                <thead className="bg-paper-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-[11px] uppercase tracking-wide text-ink-600">
                      Trade
                    </th>
                    <th className="px-3 py-2 text-left text-[11px] uppercase tracking-wide text-ink-600">
                      Scope
                    </th>
                    <th className="px-3 py-2 text-right text-[11px] uppercase tracking-wide text-ink-600">
                      Days
                    </th>
                    <th className="px-3 py-2 text-right text-[11px] uppercase tracking-wide text-ink-600">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {estimate.laborCosts.map((item) => (
                    <tr key={item.category} className="border-t border-paper-200">
                      <td className="px-3 py-2 text-sm text-ink-800">{item.category}</td>
                      <td className="px-3 py-2 text-sm text-ink-600">{item.description}</td>
                      <td className="px-3 py-2 text-sm text-ink-600 text-right">
                        {Math.ceil(item.estimatedDays)}
                      </td>
                      <td className="px-3 py-2 text-sm font-medium text-ink-950 text-right">
                        {formatNaira(item.totalCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold mb-3">
                Professional fees
              </h4>
              <div className="space-y-2 text-sm">
                <FeeRow label="Architect" amount={estimate.professionalFees.architect} />
                {estimate.professionalFees.structuralEngineer > 0 && (
                  <FeeRow
                    label="Structural engineer"
                    amount={estimate.professionalFees.structuralEngineer}
                  />
                )}
                <FeeRow
                  label="Electrical engineer"
                  amount={estimate.professionalFees.electricalEngineer}
                />
                {estimate.professionalFees.mechanicalEngineer > 0 && (
                  <FeeRow
                    label="Mechanical engineer"
                    amount={estimate.professionalFees.mechanicalEngineer}
                  />
                )}
                <FeeRow label="Project manager" amount={estimate.professionalFees.projectManager} />
              </div>
            </div>
            <div>
              <h4 className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold mb-3">
                Permits &amp; connections
              </h4>
              <div className="space-y-2 text-sm">
                <FeeRow label="Building permit" amount={estimate.permits.buildingPermit} />
                <FeeRow
                  label="Environmental approval"
                  amount={estimate.permits.environmentalApproval}
                />
                <FeeRow label="Utility connections" amount={estimate.permits.utilityConnections} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => printEstimateReport(estimate, comparisons)}
            className="w-full min-h-12 flex items-center justify-center px-6 py-3 bg-courtyard-700 text-paper-50 font-semibold hover:bg-courtyard-600"
          >
            <IconDownload size={18} className="mr-2" />
            Print or save PDF
          </button>

          <p className="text-sm text-ink-600 border border-paper-200 bg-paper-100 px-4 py-3">
            Planning estimate only. Unit rates are DirectHome’s client-reviewed Nigerian market
            rates as of August 2026. Actual costs vary by site, contractor, and availability. Get
            multiple quotes from licensed contractors before you commit.
          </p>
    </div>
  );
};

function FeeRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-600">{label}</span>
      <span className="font-semibold text-ink-950">{formatNaira(amount)}</span>
    </div>
  );
}

export default EstimatorReport;
