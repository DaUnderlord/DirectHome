import React from 'react';
import { PaymentCycle, PropertyCategory } from '../../../types/propertyOwner';
import NumberField from '../../UI/NumberField';

interface PricingStepProps {
  data: {
    rentPrice: number;
    cautionFee?: number;
    legalFee?: number;
    serviceCharge?: number;
    agencyFee?: number;
    paymentCycle: PaymentCycle;
    negotiable: boolean;
  };
  category: PropertyCategory;
  errors: Record<string, string>;
  onChange: (data: Partial<PricingStepProps['data']>) => void;
}

const PAYMENT_CYCLES = [
  { value: PaymentCycle.DAILY, label: 'Daily', forCategories: [PropertyCategory.SHORT_STAY] },
  { value: PaymentCycle.WEEKLY, label: 'Weekly', forCategories: [PropertyCategory.SHORT_STAY] },
  { value: PaymentCycle.MONTHLY, label: 'Monthly', forCategories: [PropertyCategory.RENT, PropertyCategory.LEASE] },
  { value: PaymentCycle.QUARTERLY, label: 'Quarterly', forCategories: [PropertyCategory.RENT, PropertyCategory.LEASE] },
  { value: PaymentCycle.BIANNUALLY, label: 'Bi-Annually', forCategories: [PropertyCategory.RENT, PropertyCategory.LEASE] },
  { value: PaymentCycle.YEARLY, label: 'Yearly', forCategories: [PropertyCategory.RENT, PropertyCategory.LEASE] },
  { value: PaymentCycle.PER_NIGHT, label: 'Per Night', forCategories: [PropertyCategory.SHORT_STAY] }
];

const PricingStep: React.FC<PricingStepProps> = ({ data, category, errors, onChange }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG').format(value);
  };

  const availableCycles = PAYMENT_CYCLES.filter(cycle =>
    cycle.forCategories.includes(category) || category === PropertyCategory.SALE
  );

  const getTotalUpfront = () => {
    return (data.rentPrice || 0) +
           (data.cautionFee || 0) +
           (data.legalFee || 0) +
           (data.serviceCharge || 0) +
           (data.agencyFee || 0);
  };

  const PriceInput = ({
    label,
    field,
    value,
    required = false,
    hint
  }: {
    label: string;
    field: keyof PricingStepProps['data'];
    value: number | undefined;
    required?: boolean;
    hint?: string;
  }) => (
    <NumberField
      label={`${label}${required ? ' *' : ''}`}
      prefix="₦"
      value={value ?? 0}
      min={0}
      placeholder="0"
      hint={hint}
      error={errors[`pricing.${field}`]}
      onChange={(next) => onChange({ [field]: next })}
    />
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-lg sm:text-xl font-semibold text-ink-950 mb-2">Pricing & Payment</h2>
        <p className="text-ink-600 text-sm sm:text-base">Set your rental price and additional fees</p>
      </div>

      <div className="bg-paper-100 border border-paper-200 p-4 sm:p-6">
        <h3 className="font-display text-base sm:text-lg font-semibold text-ink-950 mb-4">
          {category === PropertyCategory.SALE ? 'Sale Price' : 'Rent Price'}
        </h3>
        <PriceInput
          label={category === PropertyCategory.SALE ? 'Asking Price' : 'Rent Amount'}
          field="rentPrice"
          value={data.rentPrice}
          required
        />

        {category !== PropertyCategory.SALE && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-ink-800 mb-3">Payment Cycle</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableCycles.map((cycle) => (
                <button
                  key={cycle.value}
                  type="button"
                  onClick={() => onChange({ paymentCycle: cycle.value })}
                  className={`p-3 min-h-12 rounded-sm border text-center transition-colors ${
                    data.paymentCycle === cycle.value
                      ? 'border-courtyard-700 bg-paper-50 text-ink-950'
                      : 'border-paper-300 bg-paper-50 text-ink-700 hover:border-courtyard-500'
                  }`}
                >
                  <span className="font-medium">{cycle.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {category !== PropertyCategory.SALE && (
        <div>
          <h3 className="font-display text-base sm:text-lg font-semibold text-ink-950 mb-4">Additional Fees (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <PriceInput
              label="Caution Fee"
              field="cautionFee"
              value={data.cautionFee}
              hint="Refundable security deposit"
            />
            <PriceInput
              label="Legal Fee"
              field="legalFee"
              value={data.legalFee}
              hint="Documentation and agreement fees"
            />
            <PriceInput
              label="Service Charge"
              field="serviceCharge"
              value={data.serviceCharge}
              hint="Annual estate/building maintenance"
            />
            <PriceInput
              label="Agency Fee"
              field="agencyFee"
              value={data.agencyFee}
              hint="Commission for property agents"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 p-4 bg-paper-100 border border-paper-200">
        <div>
          <h4 className="font-medium text-ink-950">Price Negotiable?</h4>
          <p className="text-sm text-ink-500">Allow potential tenants to negotiate the price</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={data.negotiable}
          onClick={() => onChange({ negotiable: !data.negotiable })}
          className={`relative w-14 h-8 shrink-0 rounded-full transition-colors ${
            data.negotiable ? 'bg-courtyard-700' : 'bg-paper-300'
          }`}
        >
          <span
            className={`absolute top-1 w-6 h-6 bg-paper-50 rounded-full transition-transform ${
              data.negotiable ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      {category !== PropertyCategory.SALE && (
        <div className="bg-courtyard-700 text-paper-50 p-4 sm:p-6">
          <h3 className="font-display text-base sm:text-lg font-semibold mb-4">Total Upfront Payment</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-paper-200">Rent ({data.paymentCycle})</span>
              <span className="font-medium">₦{formatCurrency(data.rentPrice || 0)}</span>
            </div>
            {data.cautionFee && data.cautionFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-paper-200">Caution Fee</span>
                <span className="font-medium">₦{formatCurrency(data.cautionFee)}</span>
              </div>
            )}
            {data.legalFee && data.legalFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-paper-200">Legal Fee</span>
                <span className="font-medium">₦{formatCurrency(data.legalFee)}</span>
              </div>
            )}
            {data.serviceCharge && data.serviceCharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-paper-200">Service Charge</span>
                <span className="font-medium">₦{formatCurrency(data.serviceCharge)}</span>
              </div>
            )}
            {data.agencyFee && data.agencyFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-paper-200">Agency Fee</span>
                <span className="font-medium">₦{formatCurrency(data.agencyFee)}</span>
              </div>
            )}
            <div className="border-t border-courtyard-500 pt-3 mt-3">
              <div className="flex justify-between items-baseline gap-3">
                <span className="font-semibold">Total</span>
                <span className="font-display font-semibold text-xl sm:text-2xl">₦{formatCurrency(getTotalUpfront())}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingStep;
