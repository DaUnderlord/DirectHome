# Construction Cost Estimator for Nigeria

## Overview
Comprehensive construction cost estimation tool specifically designed for building properties in Nigeria. Provides detailed cost breakdowns for materials, labor, professional fees, permits, and more.

## Features

### 1. Multi-Step Estimation Wizard
- **Step 1**: Building Details (type, size, bedrooms, bathrooms, floors)
- **Step 2**: Location (state/city with tier-based pricing)
- **Step 3**: Finishing Quality (Basic, Standard, Premium, Luxury)
- **Step 4**: Additional Features (pool, BQ, generator, solar, etc.)
- **Step 5**: Detailed Cost Estimate

### 2. Comprehensive Cost Breakdown

#### Materials Covered:
- **Foundation**: Cement, sand, granite, laterite
- **Structure**: Iron rods (12mm, 16mm), binding wire
- **Walls**: Concrete blocks (6", 9")
- **Roofing**: Long span aluminum, stone-coated sheets, POP ceiling
- **Flooring**: Basic tiles, premium tiles, marble
- **Plumbing**: PVC pipes, water tanks, fixtures
- **Electrical**: Cables, switches, sockets
- **Doors & Windows**: Flush doors, security doors, aluminum windows
- **Painting**: Emulsion, gloss paint
- **Fixtures**: Toilets, sinks, kitchen fittings

#### Labor Categories:
- Masons (foundation, blockwork, plastering)
- Carpenters (roofing, doors, windows)
- Plumbers (water supply, drainage)
- Electricians (wiring, fixtures)
- Tilers (floor and wall tiling)
- Painters (interior and exterior)
- General laborers

#### Professional Fees:
- Architect (design and supervision)
- Structural Engineer (structural design)
- Land Surveyor (site survey)
- Project Manager (project coordination)

#### Permits & Approvals:
- Building permit
- Environmental approval
- Utility connections (water, electricity)

### 3. Location-Based Pricing

#### Tier 1 (Major Cities)
- Lagos, Abuja
- Highest material and labor costs
- Premium professional fees

#### Tier 2 (Urban Centers)
- Port Harcourt, Ibadan, Kano
- Moderate costs

#### Tier 3 (Other Cities)
- Enugu, Kaduna, Benin City, Calabar, Owerri
- Lower costs

#### Rural Areas
- Lowest costs
- Limited material availability

### 4. Building Types Supported
- **Bungalow**: Single-story residential
- **Duplex**: Two-story residential
- **Storey Building**: Multi-story residential
- **Apartment Block**: Multi-unit residential
- **Commercial**: Office/retail buildings

### 5. Finishing Quality Levels

#### Basic
- Standard materials
- Simple finishes
- Cost-effective options

#### Standard
- Good quality materials
- Decent finishes
- Balanced quality/cost

#### Premium
- High-quality materials
- Excellent finishes
- Modern amenities

#### Luxury
- Top-tier materials
- Luxury finishes
- High-end features
- Smart home integration

### 6. Additional Features Pricing

#### Major Features:
- **Swimming Pool**: ₦6M - ₦8M
- **Boys Quarters (BQ)**: ₦2.5M - ₦3.5M
- **Perimeter Fence**: ₦12K - ₦15K per meter
- **Generator (10-20kVA)**: ₦900K - ₦1.8M
- **Solar Panel System (5kW)**: ₦3.5M
- **Elevator**: ₦15M
- **Garage**: Included in main structure
- **Gate**: Included with fence

### 7. Cost Estimate Output

#### Summary Cards:
- Total estimated cost
- Cost per square meter
- Estimated duration (months)
- Building specifications

#### Detailed Breakdown:
- Material costs (itemized)
- Labor costs (by category)
- Professional fees (by professional)
- Permits and approvals
- Contingency (10-15%)
- VAT (7.5%)

#### Downloadable Report:
- Complete text report
- All cost breakdowns
- Project specifications
- Timeline estimate

## Technical Implementation

### Types (`construction.ts`)
```typescript
- ConstructionSpecs: Input specifications
- ConstructionEstimate: Complete estimate output
- CostBreakdown: Material/labor cost items
- MaterialCategory: Foundation, Structure, Roofing, etc.
- BuildingType: Bungalow, Duplex, etc.
- FinishingQuality: Basic, Standard, Premium, Luxury
- LocationTier: Tier 1, 2, 3, Rural
```

### Service (`constructionCostService.ts`)
```typescript
- calculateEstimate(): Main calculation engine
- calculateMaterialCosts(): Material cost breakdown
- calculateLaborCosts(): Labor cost estimation
- calculateProfessionalFees(): Professional fees
- calculatePermits(): Permit and approval costs
- estimateConstructionDuration(): Timeline estimation
```

### Component (`ConstructionCostEstimator.tsx`)
- Multi-step wizard interface
- Form validation
- Real-time calculations
- Report generation and download
- Responsive design

## Usage

### Accessing the Estimator
1. Navigate to `/construction-estimator`
2. Or click "Construction Cost Estimator" in footer

### Creating an Estimate

#### Step 1: Building Details
1. Select building type
2. Enter number of bedrooms and bathrooms
3. Specify number of floors
4. Input total area in square meters

#### Step 2: Location
1. Select state/city
2. System automatically determines pricing tier

#### Step 3: Finishing Quality
1. Choose quality level (Basic to Luxury)
2. Review quality descriptions

#### Step 4: Additional Features
1. Check desired features:
   - Swimming pool
   - Boys quarters
   - Garage
   - Fence and gate
   - Generator
   - Solar panels
   - Water treatment
   - Elevator (for multi-story)
2. Specify number of parking spaces

#### Step 5: Review Estimate
1. View comprehensive cost breakdown
2. Review material and labor costs
3. Check professional fees and permits
4. Download detailed report

## Pricing Data (2024)

### Sample Material Prices (Lagos - Tier 1)

| Material | Unit | Price (₦) |
|----------|------|-----------|
| Cement (50kg bag) | bag | 5,500 |
| Sharp Sand | ton | 25,000 |
| Granite | ton | 35,000 |
| Iron Rods (12mm) | 12m length | 6,500 |
| Iron Rods (16mm) | 12m length | 11,000 |
| Blocks (9 inch) | piece | 450 |
| Stone-Coated Roofing | sheet | 8,500 |
| Premium Tiles | sqm | 12,000 |
| Marble | sqm | 25,000 |
| Security Door | piece | 85,000 |
| Aluminum Windows | sqm | 18,000 |

### Sample Labor Rates (Lagos - Tier 1)

| Worker Type | Rate per Day (₦) |
|-------------|------------------|
| Mason | 8,000 |
| Carpenter | 7,500 |
| Plumber | 7,000 |
| Electrician | 7,000 |
| Tiler | 6,500 |
| Painter | 6,000 |
| Laborer | 3,500 |

## Calculation Methodology

### Material Quantities
- Foundation: 1 bag cement per 2 sqm
- Blocks: 70 blocks per sqm of wall
- Roofing: 1 sheet per 1.8 sqm
- Paint: 1 liter per 10 sqm (2 coats)

### Labor Duration
- Base: 0.5 days per sqm
- Adjusted for quality and complexity
- Additional time for special features

### Professional Fees
- Architect: ₦2,500-3,500 per sqm
- Engineer: ₦1,800-2,500 per sqm
- Surveyor: ₦350K-500K flat fee
- Project Manager: ₦1,500-2,000 per sqm

### Contingency
- Standard: 10% of subtotal
- Luxury: 15% of subtotal

### VAT
- 7.5% on total (as per Nigerian tax law)

## Example Estimates

### 3-Bedroom Bungalow (150 sqm, Lagos, Standard)
- Materials: ₦8.5M
- Labor: ₦3.2M
- Professional Fees: ₦1.1M
- Permits: ₦500K
- Contingency: ₦1.3M
- VAT: ₦1.1M
- **Total: ₦15.7M**
- Duration: 6 months

### 4-Bedroom Duplex (300 sqm, Abuja, Premium)
- Materials: ₦22M
- Labor: ₦8M
- Professional Fees: ₦2.4M
- Permits: ₦800K
- Contingency: ₦5M
- VAT: ₦2.9M
- **Total: ₦41.1M**
- Duration: 10 months

## Disclaimer
This is an estimation tool based on average market prices in Nigeria as of 2024. Actual costs may vary based on:
- Specific site conditions
- Material availability and quality
- Contractor rates and experience
- Market fluctuations
- Design complexity
- Accessibility of location
- Seasonal variations

**Always obtain multiple quotes from licensed contractors before starting construction.**

## Future Enhancements
- [ ] Save and share estimates
- [ ] Compare multiple estimates
- [ ] Material supplier directory
- [ ] Contractor recommendations
- [ ] Project timeline visualization
- [ ] Cost tracking during construction
- [ ] Regional price updates
- [ ] Currency conversion
- [ ] Mobile app version
- [ ] PDF report generation
- [ ] Email estimate delivery
