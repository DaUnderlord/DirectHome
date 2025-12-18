import React from 'react';
import { IconCurrencyNaira, IconInfoCircle } from '@tabler/icons-react';
import { PaymentCycle, PropertyCategory } from '../../../types/propertyOwner';

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

  const handlePriceChange = (field: string, value: string) => {
    const numValue = parseInt(value.replace(/,/g, '')) || 0;
    onChange({ [field]: numValue });
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
    tooltip 
  }: { 
    label: string; 
    field: string; 
    value: number | undefined;
    required?: boolean;
    tooltip?: string;
  }) => (
    <div>
      <div className="flex items-center mb-2">
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltip && (
          <div className="relative group ml-2">
            <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          <IconCurrencyNaira size={20} />
        </span>
        <input
          type="text"
          value={value ? formatCurrency(value) : ''}
          onChange={(e) => handlePriceChange(field, e.target.value)}
          placeholder="0"
          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors[`pricing.${field}`] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </div>
      {errors[`pricing.${field}`] && (
        <p className="mt-1 text-sm text-red-500">{errors[`pricing.${field}`]}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pricing & Payment</h2>
        <p className="text-gray-600">Set your rental price and additional fees</p>
      </div>

      {/* Main Price */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Cycle</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableCycles.map((cycle) => (
                <button
                  key={cycle.value}
                  type="button"
                  onClick={() => onChange({ paymentCycle: cycle.value })}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    data.paymentCycle === cycle.value
                      ? 'border-blue-500 bg-white'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">{cycle.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Fees */}
      {category !== PropertyCategory.SALE && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Fees (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PriceInput
              label="Caution Fee"
              field="cautionFee"
              value={data.cautionFee}
              tooltip="Refundable security deposit"
            />
            <PriceInput
              label="Legal Fee"
              field="legalFee"
              value={data.legalFee}
              tooltip="Documentation and agreement fees"
            />
            <PriceInput
              label="Service Charge"
              field="serviceCharge"
              value={data.serviceCharge}
              tooltip="Annual estate/building maintenance"
            />
            <PriceInput
              label="Agency Fee"
              field="agencyFee"
              value={data.agencyFee}
              tooltip="Commission for property agents"
            />
          </div>
        </div>
      )}

      {/* Negotiable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-medium text-gray-900">Price Negotiable?</h4>
          <p className="text-sm text-gray-500">Allow potential tenants to negotiate the price</p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ negotiable: !data.negotiable })}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            data.negotiable ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
              data.negotiable ? 'left-8' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* Total Summary */}
      {category !== PropertyCategory.SALE && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Total Upfront Payment</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rent ({data.paymentCycle})</span>
              <span className="font-medium">₦{formatCurrency(data.rentPrice || 0)}</span>
            </div>
            {data.cautionFee && data.cautionFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Caution Fee</span>
                <span className="font-medium">₦{formatCurrency(data.cautionFee)}</span>
              </div>
            )}
            {data.legalFee && data.legalFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Legal Fee</span>
                <span className="font-medium">₦{formatCurrency(data.legalFee)}</span>
              </div>
            )}
            {data.serviceCharge && data.serviceCharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Charge</span>
                <span className="font-medium">₦{formatCurrency(data.serviceCharge)}</span>
              </div>
            )}
            {data.agencyFee && data.agencyFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Agency Fee</span>
                <span className="font-medium">₦{formatCurrency(data.agencyFee)}</span>
              </div>
            )}
            <div className="border-t border-green-200 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-xl text-green-700">₦{formatCurrency(getTotalUpfront())}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingStep;
