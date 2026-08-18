import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconArrowLeft,
  IconMapPin,
  IconHome,
  IconBed,
  IconBath,
  IconRuler,
} from '@tabler/icons-react';
import Container from '../UI/Container';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

const statusLabel: Record<string, string> = {
  draft: 'Draft',
  pending: 'In review',
  pending_review: 'In review',
  active: 'Live',
  inactive: 'Paused',
  suspended: 'Paused',
  rejected: 'Rejected',
};

const statusClass: Record<string, string> = {
  draft: 'bg-paper-200 text-ink-700',
  pending: 'bg-paper-200 text-brass-600',
  pending_review: 'bg-paper-200 text-brass-600',
  active: 'bg-courtyard-700 text-paper-50',
  inactive: 'bg-paper-200 text-ink-700',
  suspended: 'bg-paper-200 text-ink-700',
  rejected: 'bg-paper-200 text-laterite-600',
};

const OwnerPropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { properties, isLoadingProperties, fetchProperties } = usePropertyOwnerStore();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    void fetchProperties(user.id);
  }, [user?.id, fetchProperties]);

  const property = useMemo(
    () => properties.find((item) => item.id === id),
    [properties, id]
  );

  useEffect(() => {
    setActiveImage(0);
  }, [property?.id]);

  if (isLoadingProperties && !property) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-courtyard-700 mx-auto mb-4" />
          <p className="text-ink-600">Loading listing…</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-paper-100 py-8 overflow-x-hidden">
        <Container size="md" className="min-w-0">
          <button
            type="button"
            onClick={() => navigate('/owner')}
            className="flex items-center text-ink-600 hover:text-ink-950 mb-6 text-sm"
          >
            <IconArrowLeft size={18} stroke={1.5} className="mr-2 shrink-0" />
            Back to dashboard
          </button>
          <div className="bg-paper-50 border border-paper-200 p-8 text-center">
            <IconHome size={40} stroke={1.25} className="mx-auto text-paper-300 mb-3" />
            <h1 className="font-display text-2xl font-semibold text-ink-950 mb-2">Listing not found</h1>
            <p className="text-ink-600 text-sm mb-6">
              This property may have been removed, or you may not have access to it.
            </p>
            <button
              type="button"
              onClick={() => navigate('/owner')}
              className="px-5 py-2.5 bg-courtyard-700 text-paper-50 hover:bg-courtyard-600"
            >
              Return to dashboard
            </button>
          </div>
        </Container>
      </div>
    );
  }

  const images = property.media?.images || [];
  const hero = images[activeImage]?.url || images[0]?.url;
  const cycle = property.pricing?.paymentCycle || 'yearly';

  return (
    <div className="min-h-screen bg-paper-100 py-6 sm:py-8 overflow-x-hidden">
      <Container size="lg" className="min-w-0">
        <button
          type="button"
          onClick={() => navigate('/owner')}
          className="flex items-center text-ink-600 hover:text-ink-950 mb-4 text-sm"
        >
          <IconArrowLeft size={18} stroke={1.5} className="mr-2 shrink-0" />
          Back to dashboard
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-courtyard-700 font-semibold mb-2">
              Your listing
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-950 leading-tight break-words">
              {property.basicInfo.title || 'Untitled listing'}
            </h1>
            <p className="flex items-start gap-1.5 text-ink-600 mt-2 text-sm">
              <IconMapPin size={16} stroke={1.5} className="mt-0.5 shrink-0" />
              <span>
                {property.location.fullAddress || 'Address not provided'}
                {property.location.lga ? ` · ${property.location.lga}` : ''}
                {property.location.state ? `, ${property.location.state}` : ''}
              </span>
            </p>
          </div>
          <span
            className={`px-3 py-1 text-xs font-medium shrink-0 ${
              statusClass[property.status] || 'bg-paper-200 text-ink-700'
            }`}
          >
            {statusLabel[property.status] || property.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4 min-w-0">
            <div className="bg-paper-50 border border-paper-200 overflow-hidden">
              {hero ? (
                <img
                  src={hero}
                  alt={property.basicInfo.title}
                  className="w-full h-56 sm:h-80 object-cover"
                />
              ) : (
                <div className="h-56 sm:h-80 bg-paper-200 flex items-center justify-center text-ink-500">
                  No photos yet
                </div>
              )}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={image.id || image.url}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`shrink-0 w-16 h-16 overflow-hidden border ${
                        index === activeImage ? 'border-courtyard-700' : 'border-transparent'
                      }`}
                    >
                      <img src={image.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-paper-50 border border-paper-200 p-5">
              <h2 className="font-display text-lg font-semibold text-ink-950 mb-3">About this property</h2>
              <p className="text-ink-700 text-sm leading-relaxed whitespace-pre-wrap">
                {property.basicInfo.description || 'No description provided.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 min-w-0">
            <div className="bg-courtyard-700 text-paper-50 p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-paper-200 mb-1">Asking price</p>
              <p className="font-display text-3xl font-semibold">
                {formatCurrency(property.pricing?.rentPrice || 0)}
              </p>
              <p className="text-paper-200 text-sm mt-1">
                {property.basicInfo.category === 'sale' ? 'For sale' : `Per ${cycle.replace('_', ' ')}`}
                {property.pricing?.negotiable ? ' · Negotiable' : ''}
              </p>
            </div>

            <div className="bg-paper-50 border border-paper-200 p-5">
              <h2 className="font-display text-lg font-semibold text-ink-950 mb-4">Details</h2>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-ink-500 flex items-center gap-1"><IconBed size={14} /> Bedrooms</dt>
                  <dd className="font-medium text-ink-950 mt-1">{property.features.bedrooms}</dd>
                </div>
                <div>
                  <dt className="text-ink-500 flex items-center gap-1"><IconBath size={14} /> Bathrooms</dt>
                  <dd className="font-medium text-ink-950 mt-1">{property.features.bathrooms}</dd>
                </div>
                <div>
                  <dt className="text-ink-500 flex items-center gap-1"><IconRuler size={14} /> Size</dt>
                  <dd className="font-medium text-ink-950 mt-1">{property.basicInfo.size || 0} sqm</dd>
                </div>
                <div>
                  <dt className="text-ink-500">Toilets</dt>
                  <dd className="font-medium text-ink-950 mt-1">{property.features.toilets}</dd>
                </div>
              </dl>
              {(property.pricing?.cautionFee || property.pricing?.legalFee || property.pricing?.serviceCharge) ? (
                <div className="mt-5 pt-4 border-t border-paper-200 space-y-2 text-sm">
                  {Boolean(property.pricing.cautionFee) && (
                    <div className="flex justify-between">
                      <span className="text-ink-500">Caution fee</span>
                      <span className="text-ink-950">{formatCurrency(property.pricing.cautionFee || 0)}</span>
                    </div>
                  )}
                  {Boolean(property.pricing.legalFee) && (
                    <div className="flex justify-between">
                      <span className="text-ink-500">Legal fee</span>
                      <span className="text-ink-950">{formatCurrency(property.pricing.legalFee || 0)}</span>
                    </div>
                  )}
                  {Boolean(property.pricing.serviceCharge) && (
                    <div className="flex justify-between">
                      <span className="text-ink-500">Service charge</span>
                      <span className="text-ink-950">{formatCurrency(property.pricing.serviceCharge || 0)}</span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {property.status === 'pending' || property.status === 'pending_review' ? (
              <p className="text-sm text-ink-600 bg-paper-50 border border-paper-200 p-4">
                This listing is in review. It will appear to seekers once DirectHome publishes it.
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OwnerPropertyDetail;
