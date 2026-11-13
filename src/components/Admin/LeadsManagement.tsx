import React, { useEffect, useMemo, useState } from 'react';
import { IconDownload, IconRefresh, IconSearch } from '@tabler/icons-react';
import { fetchEstimatorLeads, type EstimatorLeadRecord } from '../../services/adminLeadService';
import { BUILDING_LABELS } from '../Tools/estimatorCopy';
import { PERSONA_OPTIONS } from '../Tools/LeadCaptureForm';
import type { BuildingType } from '../../types/construction';

type ConsentFilter = 'all' | 'consented';

const PERSONA_LABELS: Record<string, string> = Object.fromEntries(
  PERSONA_OPTIONS.map((option) => [option.value, option.label])
);

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
}

function buildingLabel(type: string | null) {
  if (!type) return '—';
  return BUILDING_LABELS[type as BuildingType] || type;
}

/** Quote a value for CSV; neutralise spreadsheet formula injection. */
function csvCell(value: unknown) {
  let text = value == null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(leads: EstimatorLeadRecord[]) {
  const header = [
    'Full name',
    'Email',
    'Phone / WhatsApp',
    'Who they are',
    'State',
    'Marketing consent',
    'Consent date',
    'Estimates run',
    'Last building type',
    'Last build city',
    'First seen',
    'Last estimate',
    'Has account',
  ];
  const rows = leads.map((lead) => [
    lead.full_name,
    lead.email,
    lead.phone,
    PERSONA_LABELS[lead.persona || ''] || lead.persona,
    lead.state,
    lead.marketing_consent ? 'Yes' : 'No',
    lead.consent_at,
    lead.estimate_count,
    buildingLabel(lead.last_building_type),
    lead.last_build_city,
    lead.created_at,
    lead.last_estimate_at,
    lead.user_id ? 'Yes' : 'No',
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `directhome-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const LeadsManagement: React.FC = () => {
  const [leads, setLeads] = useState<EstimatorLeadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [consent, setConsent] = useState<ConsentFilter>('all');

  const loadLeads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchEstimatorLeads();
      if (!result.success) {
        setError(result.error || 'Could not load leads.');
        setLeads([]);
        return;
      }
      setLeads(result.leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load leads.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      if (consent === 'consented' && !lead.marketing_consent) return false;
      if (!query) return true;
      return [lead.full_name, lead.email, lead.phone, lead.state, lead.last_build_city, PERSONA_LABELS[lead.persona || '']]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [leads, searchQuery, consent]);

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      total: leads.length,
      consented: leads.filter((lead) => lead.marketing_consent).length,
      thisWeek: leads.filter((lead) => new Date(lead.created_at).getTime() >= weekAgo).length,
      estimates: leads.reduce((sum, lead) => sum + (lead.estimate_count || 0), 0),
    };
  }, [leads]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Estimator leads</h1>
          <p className="text-sm text-gray-500 mt-1">
            People who used the free estimator. Only market to those who gave consent.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadLeads()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <IconRefresh size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => downloadCsv(filtered)}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50"
          >
            <IconDownload size={16} />
            Export CSV ({filtered.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total leads', value: stats.total },
          { label: 'Marketing consent', value: stats.consented },
          { label: 'New this week', value: stats.thisWeek },
          { label: 'Estimates run', value: stats.estimates },
        ].map((card) => (
          <div key={card.label} className="bg-white p-5 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{card.value.toLocaleString('en-NG')}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone, state…"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
          />
        </div>
        <select
          value={consent}
          onChange={(e) => setConsent(e.target.value as ConsentFilter)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All leads</option>
          <option value="consented">Marketing consent only</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Contact', 'Who', 'State', 'Last build', 'Estimates', 'Consent', 'First seen'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  {lead.full_name}
                  {lead.user_id && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Account
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <a href={`mailto:${lead.email}`} className="block hover:underline">
                    {lead.email}
                  </a>
                  {lead.phone && <span className="block text-gray-500">{lead.phone}</span>}
                </td>
                <td className="px-4 py-3 text-gray-700">{PERSONA_LABELS[lead.persona || ''] || '—'}</td>
                <td className="px-4 py-3 text-gray-700">{lead.state || '—'}</td>
                <td className="px-4 py-3 text-gray-700">
                  {buildingLabel(lead.last_building_type)}
                  {lead.last_build_city && <span className="block text-gray-500">{lead.last_build_city}</span>}
                </td>
                <td className="px-4 py-3 text-gray-700">{lead.estimate_count}</td>
                <td className="px-4 py-3">
                  {lead.marketing_consent ? (
                    <span className="text-emerald-700 font-medium">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(lead.created_at)}</td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                  {leads.length === 0 ? 'No leads yet.' : 'No leads match your search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsManagement;
