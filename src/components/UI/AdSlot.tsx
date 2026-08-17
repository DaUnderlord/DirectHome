import React from 'react';

interface AdSlotProps {
  slot?: string;
  label?: string;
  className?: string;
}

/**
 * AdSense-ready placeholder. Renders nothing until VITE_ADSENSE_CLIENT is configured.
 */
const AdSlot: React.FC<AdSlotProps> = ({ slot, label = 'Advertisement', className = '' }) => {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT;
  const slotId = slot || import.meta.env.VITE_ADSENSE_SLOT_DEFAULT;

  if (!clientId || !slotId) {
    return null;
  }

  return (
    <div
      className={`ad-slot min-h-[90px] border border-dashed border-paper-300 bg-paper-50 flex items-center justify-center ${className}`}
      aria-label={label}
    >
      <ins
        className="adsbygoogle block w-full"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSlot;
