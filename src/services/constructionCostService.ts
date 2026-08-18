import {
  ConstructionSpecs,
  ConstructionEstimate,
  CostBreakdown,
  LaborCost,
  MaterialCategory,
  FinishingQuality,
  LocationTier,
  BuildingType,
  MaterialPriceDatabase,
  RoofingChoice,
  BuildStage,
  CashPhase,
  QualityComparison,
} from '../types/construction';

/**
 * Comprehensive Construction Cost Estimator for Nigeria
 * Prices are in Nigerian Naira (₦) — updated per client review
 */

// Material prices database (prices vary by location tier)
const MATERIAL_PRICES: MaterialPriceDatabase = {
  // Foundation Materials
  cement: {
    name: 'Cement (Dangote/BUA)',
    unit: 'bag (50kg)',
    prices: { tier_1: 13000, tier_2: 12500, tier_3: 12000, rural: 11000 },
    category: MaterialCategory.FOUNDATION
  },
  sharp_sand: {
    name: 'Sharp Sand',
    unit: 'ton',
    prices: { tier_1: 12000, tier_2: 10000, tier_3: 10000, rural: 8000 },
    category: MaterialCategory.FOUNDATION
  },
  granite: {
    name: 'Granite (3/4 inch)',
    unit: 'ton',
    prices: { tier_1: 15000, tier_2: 14000, tier_3: 12000, rural: 10000 },
    category: MaterialCategory.FOUNDATION
  },
  laterite: {
    name: 'Laterite',
    unit: 'ton',
    prices: { tier_1: 15000, tier_2: 12000, tier_3: 10000, rural: 8000 },
    category: MaterialCategory.FOUNDATION
  },
  
  // Structural Materials
  iron_rods_12mm: {
    name: 'Iron Rods (12mm)',
    unit: 'length (12m)',
    prices: { tier_1: 11500, tier_2: 11000, tier_3: 10000, rural: 9500 },
    category: MaterialCategory.STRUCTURE
  },
  iron_rods_16mm: {
    name: 'Iron Rods (16mm)',
    unit: 'length (12m)',
    prices: { tier_1: 20000, tier_2: 19000, tier_3: 18000, rural: 17000 },
    category: MaterialCategory.STRUCTURE
  },
  binding_wire: {
    name: 'Binding Wire',
    unit: 'kg',
    prices: { tier_1: 2500, tier_2: 2500, tier_3: 2500, rural: 2500 },
    category: MaterialCategory.STRUCTURE
  },
  
  // Blocks and Bricks
  blocks_6inch: {
    name: 'Concrete Blocks (6 inch)',
    unit: 'piece',
    prices: { tier_1: 1100, tier_2: 1000, tier_3: 900, rural: 800 },
    category: MaterialCategory.WALLS
  },
  blocks_9inch: {
    name: 'Concrete Blocks (9 inch)',
    unit: 'piece',
    prices: { tier_1: 1200, tier_2: 1100, tier_3: 1000, rural: 900 },
    category: MaterialCategory.WALLS
  },
  
  // Roofing Materials
  roofing_sheets_longspan: {
    name: 'Long Span Aluminum Roofing Sheets',
    unit: 'sheet',
    prices: { tier_1: 10000, tier_2: 9000, tier_3: 7000, rural: 6000 },
    category: MaterialCategory.ROOFING
  },
  roofing_sheets_stone_coated: {
    name: 'Stone Coated Roofing Sheets',
    unit: 'sheet',
    prices: { tier_1: 8000, tier_2: 6800, tier_3: 5000, rural: 4500 },
    category: MaterialCategory.ROOFING
  },
  ceiling_board_pop: {
    name: 'POP Ceiling Board',
    unit: 'sqm',
    prices: { tier_1: 10000, tier_2: 9000, tier_3: 8500, rural: 7500 },
    category: MaterialCategory.ROOFING
  },
  
  // Flooring
  tiles_basic: {
    name: 'Floor Tiles (Basic)',
    unit: 'sqm',
    prices: { tier_1: 12000, tier_2: 10000, tier_3: 7000, rural: 6000 },
    category: MaterialCategory.FLOORING
  },
  tiles_premium: {
    name: 'Floor Tiles (Premium)',
    unit: 'sqm',
    prices: { tier_1: 29000, tier_2: 26500, tier_3: 24000, rural: 22000 },
    category: MaterialCategory.FLOORING
  },
  marble: {
    name: 'Marble Flooring',
    unit: 'sqm',
    prices: { tier_1: 40000, tier_2: 35000, tier_3: 32000, rural: 28000 },
    category: MaterialCategory.FLOORING
  },
  
  // Plumbing
  pvc_pipes_4inch: {
    name: 'PVC Pipes (4 inch)',
    unit: 'length (3m)',
    prices: { tier_1: 9500, tier_2: 9500, tier_3: 5800, rural: 5200 },
    category: MaterialCategory.PLUMBING
  },
  water_tank_1000l: {
    name: 'Water Tank (1000L)',
    unit: 'piece',
    prices: { tier_1: 110000, tier_2: 110000, tier_3: 110000, rural: 100000 },
    category: MaterialCategory.PLUMBING
  },
  
  // Electrical
  electrical_cables: {
    name: 'Electrical Cables (per meter)',
    unit: 'meter',
    prices: { tier_1: 130000, tier_2: 75000, tier_3: 36000, rural: 32000 },
    category: MaterialCategory.ELECTRICAL
  },
  
  // Doors and Windows
  door_flush: {
    name: 'Flush Door',
    unit: 'piece',
    prices: { tier_1: 150000, tier_2: 120000, tier_3: 100000, rural: 90000 },
    category: MaterialCategory.DOORS_WINDOWS
  },
  door_security: {
    name: 'Security Door (Steel)',
    unit: 'piece',
    prices: { tier_1: 480000, tier_2: 250000, tier_3: 150000, rural: 130000 },
    category: MaterialCategory.DOORS_WINDOWS
  },
  windows_aluminum: {
    name: 'Aluminum Windows',
    unit: 'sqm',
    prices: { tier_1: 135000, tier_2: 180000, tier_3: 110000, rural: 90000 },
    category: MaterialCategory.DOORS_WINDOWS
  },
  
  // Paint
  paint_emulsion: {
    name: 'Emulsion Paint',
    unit: 'liter',
    prices: { tier_1: 6000, tier_2: 4000, tier_3: 2000, rural: 1800 },
    category: MaterialCategory.PAINTING
  },
  paint_gloss: {
    name: 'Gloss Paint',
    unit: 'liter',
    prices: { tier_1: 9500, tier_2: 9500, tier_3: 9300, rural: 9000 },
    category: MaterialCategory.PAINTING
  }
};

const FINISHING_QUALITY_RANK: Record<FinishingQuality, number> = {
  [FinishingQuality.ECONOMY]: 0,
  [FinishingQuality.STANDARD]: 1,
  [FinishingQuality.PREMIUM]: 2,
  [FinishingQuality.LUXURY]: 3,
};

// Labor rates per day (skilled workers)
const LABOR_RATES = {
  mason: { tier_1: 15000, tier_2: 10000, tier_3: 10000, rural: 8000 },
  carpenter: { tier_1: 15000, tier_2: 10000, tier_3: 10000, rural: 8000 },
  plumber: { tier_1: 15000, tier_2: 10000, tier_3: 10000, rural: 8000 },
  electrician: { tier_1: 18000, tier_2: 12000, tier_3: 12000, rural: 10000 },
  tiler: { tier_1: 1500, tier_2: 1000, tier_3: 800, rural: 700 },
  painter: { tier_1: 15000, tier_2: 12000, tier_3: 10000, rural: 8000 },
  laborer: { tier_1: 15000, tier_2: 12000, tier_3: 10000, rural: 8000 }
};

class ConstructionCostService {
  /**
   * Calculate comprehensive construction cost estimate
   */
  calculateEstimate(specs: ConstructionSpecs): ConstructionEstimate {
    const sqm = specs.totalSquareMeters;
    
    // Calculate material costs
    const materialCosts = this.calculateMaterialCosts(specs);
    const addonCosts = this.calculateAddonCosts(specs);
    
    // Calculate labor costs
    const laborCosts = this.calculateLaborCosts(specs);
    
    // Calculate professional fees
    const professionalFees = this.calculateProfessionalFees(specs);
    
    // Calculate permits and approvals
    const permits = this.calculatePermits(specs);
    
    // Calculate totals
    const materialsTotal = materialCosts.reduce((sum, item) => sum + item.totalCost, 0);
    const addonsTotal = addonCosts.reduce((sum, item) => sum + item.totalCost, 0);
    const laborTotal = laborCosts.reduce((sum, item) => sum + item.totalCost, 0);
    const subtotal = materialsTotal + laborTotal + professionalFees.total + permits.total + addonsTotal;
    
    // Contingency (10-15% depending on complexity)
    const contingencyRate = specs.finishingQuality === FinishingQuality.LUXURY ? 0.15 : 0.10;
    const contingency = subtotal * contingencyRate;
    
    // VAT (7.5% in Nigeria)
    const vat = (subtotal + contingency) * 0.075;
    
    const grandTotal = subtotal + contingency + vat;
    const costPerSquareMeter = grandTotal / sqm;
    
    // Estimate duration
    const estimatedDuration = this.estimateConstructionDuration(specs);
    const stages = this.buildStages(materialCosts, laborCosts, addonCosts);
    const cashPlan = this.buildCashPlan(
      stages,
      professionalFees.total,
      permits.total,
      contingency,
      vat,
      estimatedDuration.months
    );

    return {
      specs,
      materialCosts,
      addonCosts,
      laborCosts,
      professionalFees,
      permits,
      contingency,
      subtotal,
      vat,
      grandTotal,
      costPerSquareMeter,
      estimatedDuration,
      breakdown: {
        materials: materialsTotal,
        labor: laborTotal,
        professional: professionalFees.total,
        permits: permits.total,
        addons: addonsTotal,
        contingency
      },
      stages,
      cashPlan,
    };
  }

  compareQualityLevels(specs: ConstructionSpecs): QualityComparison[] {
    return [
      FinishingQuality.ECONOMY,
      FinishingQuality.STANDARD,
      FinishingQuality.PREMIUM,
      FinishingQuality.LUXURY,
    ].map((quality) => {
      const estimate = this.calculateEstimate({ ...specs, finishingQuality: quality });
      return {
        quality,
        grandTotal: estimate.grandTotal,
        costPerSquareMeter: estimate.costPerSquareMeter,
        months: estimate.estimatedDuration.months,
      };
    });
  }

  private calculateMaterialCosts(specs: ConstructionSpecs): CostBreakdown[] {
    const costs: CostBreakdown[] = [];
    const tier = specs.location.tier;
    const sqm = specs.totalSquareMeters;
    const floors = specs.numberOfFloors;
    
    // Foundation materials (per sqm of building footprint)
    const footprintSqm = sqm / floors;
    
    // Cement for foundation (1 bag per 2 sqm)
    costs.push(this.createCostItem(
      'Foundation Cement',
      footprintSqm / 2,
      'bags',
      MATERIAL_PRICES.cement.prices[tier],
      MaterialCategory.FOUNDATION
    ));
    
    // Sharp sand for foundation (0.5 tons per 10 sqm)
    costs.push(this.createCostItem(
      'Sharp Sand',
      (footprintSqm / 10) * 0.5,
      'tons',
      MATERIAL_PRICES.sharp_sand.prices[tier],
      MaterialCategory.FOUNDATION
    ));
    
    // Granite (0.7 tons per 10 sqm)
    costs.push(this.createCostItem(
      'Granite',
      (footprintSqm / 10) * 0.7,
      'tons',
      MATERIAL_PRICES.granite.prices[tier],
      MaterialCategory.FOUNDATION
    ));
    
    // Structural materials - Iron rods
    const ironRodsQuantity = sqm * 0.8; // 0.8 lengths per sqm
    costs.push(this.createCostItem(
      'Iron Rods (12mm)',
      ironRodsQuantity * 0.6,
      'lengths',
      MATERIAL_PRICES.iron_rods_12mm.prices[tier],
      MaterialCategory.STRUCTURE
    ));
    
    costs.push(this.createCostItem(
      'Iron Rods (16mm)',
      ironRodsQuantity * 0.4,
      'lengths',
      MATERIAL_PRICES.iron_rods_16mm.prices[tier],
      MaterialCategory.STRUCTURE
    ));
    
    // Blocks for walls (estimate 70 blocks per sqm of wall)
    const wallSqm = this.estimateWallArea(specs);
    const blockType = specs.finishingQuality === FinishingQuality.ECONOMY ? 'blocks_6inch' : 'blocks_9inch';
    costs.push(this.createCostItem(
      MATERIAL_PRICES[blockType].name,
      wallSqm * 70,
      'pieces',
      MATERIAL_PRICES[blockType].prices[tier],
      MaterialCategory.WALLS
    ));
    
    // Roofing materials — explicit choice, or match finishing quality
    const roofingType =
      specs.roofing === RoofingChoice.LONGSPAN
        ? 'roofing_sheets_longspan'
        : specs.roofing === RoofingChoice.STONE_COATED
        ? 'roofing_sheets_stone_coated'
        : FINISHING_QUALITY_RANK[specs.finishingQuality] >= FINISHING_QUALITY_RANK[FinishingQuality.PREMIUM]
          ? 'roofing_sheets_stone_coated'
          : 'roofing_sheets_longspan';
    
    costs.push(this.createCostItem(
      MATERIAL_PRICES[roofingType].name,
      footprintSqm / 1.8, // Each sheet covers ~1.8 sqm
      'sheets',
      MATERIAL_PRICES[roofingType].prices[tier],
      MaterialCategory.ROOFING
    ));
    
    // Ceiling
    costs.push(this.createCostItem(
      'POP Ceiling',
      sqm,
      'sqm',
      MATERIAL_PRICES.ceiling_board_pop.prices[tier],
      MaterialCategory.ROOFING
    ));
    
    // Flooring
    const flooringType = 
      specs.finishingQuality === FinishingQuality.LUXURY ? 'marble' :
      specs.finishingQuality === FinishingQuality.PREMIUM ? 'tiles_premium' :
      'tiles_basic';
    
    costs.push(this.createCostItem(
      MATERIAL_PRICES[flooringType].name,
      sqm,
      'sqm',
      MATERIAL_PRICES[flooringType].prices[tier],
      MaterialCategory.FLOORING
    ));
    
    // Doors (estimate based on bedrooms + bathrooms + common areas)
    const totalDoors = specs.numberOfBedrooms + specs.numberOfBathrooms + 3;
    costs.push(this.createCostItem(
      'Interior Doors',
      totalDoors,
      'pieces',
      MATERIAL_PRICES.door_flush.prices[tier],
      MaterialCategory.DOORS_WINDOWS
    ));
    
    costs.push(this.createCostItem(
      'Security Doors',
      2, // Main entrance + back door
      'pieces',
      MATERIAL_PRICES.door_security.prices[tier],
      MaterialCategory.DOORS_WINDOWS
    ));
    
    // Windows (estimate 15% of wall area)
    const windowArea = wallSqm * 0.15;
    costs.push(this.createCostItem(
      'Aluminum Windows',
      windowArea,
      'sqm',
      MATERIAL_PRICES.windows_aluminum.prices[tier],
      MaterialCategory.DOORS_WINDOWS
    ));
    
    // Plumbing materials
    costs.push(this.createCostItem(
      'PVC Pipes (4 inch)',
      specs.numberOfBathrooms * 10, // 10 lengths per bathroom
      'lengths',
      MATERIAL_PRICES.pvc_pipes_4inch.prices[tier],
      MaterialCategory.PLUMBING
    ));
    
    costs.push(this.createCostItem(
      'Water Storage Tank',
      1,
      'piece',
      MATERIAL_PRICES.water_tank_1000l.prices[tier],
      MaterialCategory.PLUMBING
    ));
    
    // Electrical materials (estimate 100m of cable per bedroom)
    costs.push(this.createCostItem(
      'Electrical Cables',
      specs.numberOfBedrooms * 100,
      'meters',
      MATERIAL_PRICES.electrical_cables.prices[tier],
      MaterialCategory.ELECTRICAL
    ));
    
    // Painting (2 coats, 1 liter per 10 sqm)
    const paintArea = sqm * 2; // Interior + exterior
    costs.push(this.createCostItem(
      'Emulsion Paint',
      (paintArea / 10) * 2, // 2 coats
      'liters',
      MATERIAL_PRICES.paint_emulsion.prices[tier],
      MaterialCategory.PAINTING
    ));
    
    const total = costs.reduce((sum, item) => sum + item.totalCost, 0);
    costs.forEach(item => {
      item.percentage = total > 0 ? (item.totalCost / total) * 100 : 0;
    });
    
    return costs;
  }

  private calculateAddonCosts(specs: ConstructionSpecs): CostBreakdown[] {
    const costs: CostBreakdown[] = [];
    const tier = specs.location.tier;
    const sqm = specs.totalSquareMeters;
    const floors = specs.numberOfFloors;
    const footprintSqm = sqm / floors;
    const isTier1 = tier === LocationTier.TIER_1;
    
    if (specs.features.hasSwimmingPool) {
      costs.push(this.createCostItem(
        'Swimming Pool Construction',
        1,
        'unit',
        isTier1 ? 10000000 : 8000000,
        MaterialCategory.FIXTURES
      ));
    }
    
    if (specs.features.hasBQ) {
      costs.push(this.createCostItem(
        'Boys Quarters (BQ)',
        1,
        'unit',
        isTier1 ? 4000000 : 3500000,
        MaterialCategory.STRUCTURE
      ));
    }
    
    if (specs.features.hasFence) {
      const plot = specs.plotSquareMeters > 0 ? specs.plotSquareMeters : footprintSqm * 2.25;
      const perimeterEstimate = Math.sqrt(plot) * 4 * (specs.plotSquareMeters > 0 ? 1.05 : 1.5);
      costs.push(this.createCostItem(
        'Fence/Wall (per meter)',
        perimeterEstimate,
        'meters',
        isTier1 ? 15000 : 12000,
        MaterialCategory.STRUCTURE
      ));
    }

    if (specs.features.hasGate) {
      costs.push(this.createCostItem(
        'Entrance gate',
        1,
        'set',
        isTier1 ? 450000 : 350000,
        MaterialCategory.DOORS_WINDOWS
      ));
    }

    if (specs.features.hasGarage) {
      const bays = Math.max(1, specs.features.numberOfParkingSpaces || 1);
      costs.push(this.createCostItem(
        `Covered garage (${bays} bay${bays === 1 ? '' : 's'})`,
        bays,
        'bay',
        isTier1 ? 1200000 : 1000000,
        MaterialCategory.STRUCTURE
      ));
    }

    if (specs.features.hasWaterTreatment) {
      costs.push(this.createCostItem(
        'Water treatment plant',
        1,
        'system',
        isTier1 ? 2500000 : 2000000,
        MaterialCategory.PLUMBING
      ));
    }
    
    if (specs.features.hasGenerator) {
      const generatorSize = sqm > 200 ? 20 : 10;
      const generatorCost =
        generatorSize === 20
          ? (isTier1 ? 12000000 : 10000000)
          : (isTier1 ? 10000000 : 8000000);
      costs.push(this.createCostItem(
        `Generator (${generatorSize}kVA)`,
        1,
        'unit',
        generatorCost,
        MaterialCategory.ELECTRICAL
      ));
    }
    
    if (specs.features.hasSolarPanels) {
      costs.push(this.createCostItem(
        'Solar Panel System (5kW)',
        1,
        'system',
        isTier1 ? 3800000 : 3000000,
        MaterialCategory.ELECTRICAL
      ));
    }
    
    if (specs.features.hasElevator && floors > 2) {
      costs.push(this.createCostItem(
        'Elevator Installation',
        1,
        'unit',
        isTier1 ? 45000000 : 30000000,
        MaterialCategory.FIXTURES
      ));
    }
    
    const total = costs.reduce((sum, item) => sum + item.totalCost, 0);
    costs.forEach(item => {
      item.percentage = total > 0 ? (item.totalCost / total) * 100 : 0;
    });
    
    return costs;
  }

  private calculateLaborCosts(specs: ConstructionSpecs): LaborCost[] {
    const costs: LaborCost[] = [];
    const tier = specs.location.tier;
    const sqm = specs.totalSquareMeters;
    
    // Estimate work days based on building size and complexity
    const baseWorkDays = sqm * 0.5; // 0.5 days per sqm as baseline
    const complexityMultiplier = 
      specs.finishingQuality === FinishingQuality.LUXURY ? 1.5 :
      specs.finishingQuality === FinishingQuality.PREMIUM ? 1.3 :
      specs.finishingQuality === FinishingQuality.STANDARD ? 1.1 : 1.0;
    
    const totalWorkDays = baseWorkDays * complexityMultiplier;
    
    // Masons (foundation, blocks, plastering)
    costs.push({
      category: 'Masonry',
      description: 'Foundation, blockwork, plastering',
      estimatedDays: totalWorkDays * 0.4,
      costPerDay: LABOR_RATES.mason[tier],
      totalCost: totalWorkDays * 0.4 * LABOR_RATES.mason[tier]
    });
    
    // Carpenters (roofing, doors, windows)
    costs.push({
      category: 'Carpentry',
      description: 'Roofing, doors, windows, ceiling',
      estimatedDays: totalWorkDays * 0.25,
      costPerDay: LABOR_RATES.carpenter[tier],
      totalCost: totalWorkDays * 0.25 * LABOR_RATES.carpenter[tier]
    });
    
    // Plumbers
    costs.push({
      category: 'Plumbing',
      description: 'Water supply, drainage, fixtures',
      estimatedDays: specs.numberOfBathrooms * 15,
      costPerDay: LABOR_RATES.plumber[tier],
      totalCost: specs.numberOfBathrooms * 15 * LABOR_RATES.plumber[tier]
    });
    
    // Electricians
    costs.push({
      category: 'Electrical',
      description: 'Wiring, fixtures, connections',
      estimatedDays: sqm * 0.15,
      costPerDay: LABOR_RATES.electrician[tier],
      totalCost: sqm * 0.15 * LABOR_RATES.electrician[tier]
    });
    
    // Tilers — client rate is per sqm, not per day
    costs.push({
      category: 'Tiling',
      description: 'Floor and wall tiling (priced per sqm)',
      estimatedDays: sqm * 0.2,
      costPerDay: LABOR_RATES.tiler[tier],
      totalCost: sqm * LABOR_RATES.tiler[tier]
    });
    
    // Painters
    costs.push({
      category: 'Painting',
      description: 'Interior and exterior painting',
      estimatedDays: sqm * 0.15,
      costPerDay: LABOR_RATES.painter[tier],
      totalCost: sqm * 0.15 * LABOR_RATES.painter[tier]
    });
    
    // General laborers
    costs.push({
      category: 'General Labor',
      description: 'Site clearing, material handling, cleanup',
      estimatedDays: totalWorkDays * 0.6,
      costPerDay: LABOR_RATES.laborer[tier],
      totalCost: totalWorkDays * 0.6 * LABOR_RATES.laborer[tier]
    });
    
    return costs;
  }

  private calculateProfessionalFees(specs: ConstructionSpecs): {
    architect: number;
    structuralEngineer: number;
    electricalEngineer: number;
    mechanicalEngineer: number;
    projectManager: number;
    total: number;
  } {
    const sqm = specs.totalSquareMeters;
    const tier = specs.location.tier;
    const isBungalow = specs.buildingType === BuildingType.BUNGALOW;
    const specialistPerSqm = tier === LocationTier.TIER_1 ? 2500 : 1800;

    const architect = sqm * (tier === LocationTier.TIER_1 ? 3500 : 2500);
    const structuralEngineer = isBungalow ? 0 : sqm * specialistPerSqm;
    const electricalEngineer = sqm * specialistPerSqm;
    const mechanicalEngineer = isBungalow ? 0 : sqm * specialistPerSqm;
    const projectManager = sqm * (tier === LocationTier.TIER_1 ? 2000 : 1500);

    return {
      architect,
      structuralEngineer,
      electricalEngineer,
      mechanicalEngineer,
      projectManager,
      total: architect + structuralEngineer + electricalEngineer + mechanicalEngineer + projectManager
    };
  }

  private calculatePermits(specs: ConstructionSpecs): {
    buildingPermit: number;
    environmentalApproval: number;
    utilityConnections: number;
    total: number;
  } {
    const tier = specs.location.tier;
    const sqm = specs.totalSquareMeters;
    
    // Building permit costs vary by location and size
    const buildingPermit = 
      tier === LocationTier.TIER_1 ? sqm * 500 :
      tier === LocationTier.TIER_2 ? sqm * 350 :
      sqm * 200;
    
    const environmentalApproval = 
      tier === LocationTier.TIER_1 ? 250000 :
      tier === LocationTier.TIER_2 ? 150000 :
      100000;
    
    const utilityConnections = 
      tier === LocationTier.TIER_1 ? 400000 :
      tier === LocationTier.TIER_2 ? 300000 :
      200000;
    
    return {
      buildingPermit,
      environmentalApproval,
      utilityConnections,
      total: buildingPermit + environmentalApproval + utilityConnections
    };
  }

  private estimateWallArea(specs: ConstructionSpecs): number {
    // Rough estimate: perimeter * height * floors
    const footprintSqm = specs.totalSquareMeters / specs.numberOfFloors;
    const perimeter = Math.sqrt(footprintSqm) * 4;
    const wallHeight = 3; // meters per floor
    return perimeter * wallHeight * specs.numberOfFloors;
  }

  private estimateConstructionDuration(specs: ConstructionSpecs): { months: number; description: string } {
    const sqm = specs.totalSquareMeters;
    const floors = specs.numberOfFloors;
    const quality = specs.finishingQuality;
    
    // Base duration: 1 month per 50 sqm
    let months = sqm / 50;
    
    // Adjust for floors
    months += (floors - 1) * 2;
    
    // Adjust for quality
    if (quality === FinishingQuality.LUXURY) months *= 1.4;
    else if (quality === FinishingQuality.PREMIUM) months *= 1.2;
    
    // Add time for special features
    if (specs.features.hasSwimmingPool) months += 2;
    if (specs.features.hasElevator) months += 3;
    if (specs.features.hasBQ) months += 2;
    
    months = Math.ceil(months);
    
    const description = `Estimated ${months} months including foundation, structure, roofing, finishing, and inspections`;
    
    return { months, description };
  }

  private buildStages(
    materialCosts: CostBreakdown[],
    laborCosts: LaborCost[],
    addonCosts: CostBreakdown[]
  ): BuildStage[] {
    const materialBucket = (item: CostBreakdown): BuildStage['id'] => {
      switch (item.category) {
        case MaterialCategory.FOUNDATION:
          return 'substructure';
        case MaterialCategory.STRUCTURE:
        case MaterialCategory.WALLS:
        case MaterialCategory.ROOFING:
          return 'carcass';
        default:
          return 'finishing';
      }
    };

    const materials = {
      substructure: 0,
      carcass: 0,
      finishing: 0,
      extras: addonCosts.reduce((sum, item) => sum + item.totalCost, 0),
    };

    materialCosts.forEach((item) => {
      materials[materialBucket(item)] += item.totalCost;
    });

    const labor = { substructure: 0, carcass: 0, finishing: 0, extras: 0 };
    laborCosts.forEach((item) => {
      const key = item.category.toLowerCase();
      if (key.includes('mason')) {
        labor.substructure += item.totalCost * 0.55;
        labor.carcass += item.totalCost * 0.45;
      } else if (key.includes('carpent') || key.includes('general')) {
        if (key.includes('general')) {
          labor.substructure += item.totalCost * 0.2;
          labor.carcass += item.totalCost * 0.4;
          labor.finishing += item.totalCost * 0.4;
        } else {
          labor.carcass += item.totalCost;
        }
      } else {
        labor.finishing += item.totalCost;
      }
    });

    const make = (
      id: BuildStage['id'],
      label: string
    ): BuildStage => ({
      id,
      label,
      materials: materials[id],
      labor: labor[id],
      total: materials[id] + labor[id],
    });

    return [
      make('substructure', 'Substructure'),
      make('carcass', 'Carcass'),
      make('finishing', 'Finishing'),
      make('extras', 'Site extras'),
    ];
  }

  private buildCashPlan(
    stages: BuildStage[],
    professional: number,
    permits: number,
    contingency: number,
    vat: number,
    months: number
  ): CashPhase[] {
    const span = Math.max(3, months);
    const foundationMonths = Math.max(1, Math.round(span * 0.25));
    const carcassMonths = Math.max(1, Math.round(span * 0.4));
    const finishingMonths = Math.max(1, span - foundationMonths - carcassMonths);

    const sub = stages.find((s) => s.id === 'substructure')?.total || 0;
    const car = stages.find((s) => s.id === 'carcass')?.total || 0;
    const fin =
      (stages.find((s) => s.id === 'finishing')?.total || 0) +
      (stages.find((s) => s.id === 'extras')?.total || 0);

    const phase1 = sub + permits + professional * 0.5;
    const phase2 = car + professional * 0.5;
    const phase3 = fin + contingency + vat;
    const total = phase1 + phase2 + phase3;

    const share = (amount: number) => (total > 0 ? (amount / total) * 100 : 0);

    return [
      {
        label: 'Foundation',
        window: `Months 1–${foundationMonths}`,
        amount: phase1,
        share: share(phase1),
      },
      {
        label: 'Carcass',
        window: `Months ${foundationMonths + 1}–${foundationMonths + carcassMonths}`,
        amount: phase2,
        share: share(phase2),
      },
      {
        label: 'Finishing',
        window: `Months ${foundationMonths + carcassMonths + 1}–${foundationMonths + carcassMonths + finishingMonths}`,
        amount: phase3,
        share: share(phase3),
      },
    ];
  }

  private createCostItem(
    description: string,
    quantity: number,
    unit: string,
    unitCost: number,
    category: MaterialCategory
  ): CostBreakdown {
    return {
      category: category,
      description,
      quantity: Math.ceil(quantity),
      unit,
      unitCost,
      totalCost: Math.ceil(quantity) * unitCost,
      percentage: 0 // Will be calculated later
    };
  }
}

export const constructionCostService = new ConstructionCostService();
export default constructionCostService;
