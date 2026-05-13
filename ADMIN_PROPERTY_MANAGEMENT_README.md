# Admin Property Management System

## Overview
Comprehensive admin property management system with single property onboarding, bulk CSV import, approval workflow, and property CRUD operations.

## Features

### 1. Property Management Dashboard
- **Location**: `/admin/properties`
- **Access**: Admin users only
- View all properties with filtering by status (All, Pending, Active, Rejected)
- Search properties by title, city, or state
- Real-time property statistics

### 2. Single Property Onboarding
- Add individual properties through the admin interface
- Set property owner, status, and verification status
- Full property details including:
  - Basic info (title, description, type)
  - Location (address, city, state, coordinates)
  - Features (bedrooms, bathrooms, amenities)
  - Pricing (rent, security deposit, payment frequency)
  - Availability and rules
  - Images

### 3. Bulk Property Import (CSV)
- Import multiple properties at once via CSV file
- Download CSV template with all required fields
- Real-time import progress tracking
- Detailed error reporting for failed imports
- Success/failure statistics

#### CSV Template Fields:
```csv
ownerId,title,description,propertyType,listingType,address,city,state,zipCode,country,latitude,longitude,bedrooms,bathrooms,squareFootage,yearBuilt,furnished,petsAllowed,amenities,price,currency,paymentFrequency,securityDeposit,negotiable,availableFrom,minimumStay,maximumStay,smokingAllowed,partiesAllowed,childrenAllowed,additionalRules,images,status,verificationStatus
```

### 4. Property Approval Workflow
- Review pending properties
- Approve or reject properties with one click
- Add admin notes and rejection reasons
- Automatic status updates

### 5. Property Actions
- **View**: See full property details
- **Approve**: Change status to active and verified
- **Reject**: Mark property as rejected with reason
- **Delete**: Permanently remove property (with confirmation)

## Technical Implementation

### Services
- **`adminPropertyService.ts`**: Backend service handling all admin property operations
  - `createProperty()`: Create single property
  - `bulkImportProperties()`: Import from CSV
  - `updatePropertyStatus()`: Approve/reject properties
  - `getPendingProperties()`: Get approval queue
  - `getAllProperties()`: Get all properties with filters
  - `deleteProperty()`: Remove property

### Components
- **`PropertyManagement.tsx`**: Main admin property management UI
  - Tabbed interface (All, Pending, Active, Rejected)
  - Search and filter functionality
  - Property table with actions
  - Bulk import modal
  - CSV template download

### Dependencies
- **papaparse**: CSV parsing library for bulk import

## Usage

### Accessing Property Management
1. Login as admin user
2. Navigate to `/admin/properties`
3. Use the interface to manage properties

### Single Property Creation
1. Click "Add Property" button
2. Fill in property details
3. Submit to create

### Bulk Import
1. Click "Bulk Import" button
2. Download CSV template
3. Fill template with property data
4. Upload CSV file
5. Monitor import progress
6. Review success/failure report

### Approving Properties
1. Go to "Pending Approval" tab
2. Review property details
3. Click ✓ to approve or ✗ to reject
4. Property status updates automatically

## CSV Import Tips

### Required Fields
- `ownerId`: User ID of property owner
- `title`: Property title
- `propertyType`: apartment, house, duplex, etc.

### Optional Fields
- Most fields are optional with sensible defaults
- Images: Comma-separated URLs
- Amenities: Comma-separated list
- Boolean fields: Use "true" or "false"

### Example CSV Row
```csv
user-123,Modern 3BR Apartment,Beautiful apartment in VI,apartment,rent,123 Main St,Lagos,Lagos,100001,Nigeria,6.5244,3.3792,3,2,1200,2020,true,false,"WiFi,Parking,Security",500000,NGN,monthly,1000000,true,2024-01-01,1,12,false,false,true,"No loud music after 10pm",https://example.com/image1.jpg,active,verified
```

## Error Handling
- Invalid CSV format: Shows parsing error
- Missing required fields: Skips row with error message
- Database errors: Logs error and continues with next row
- Network errors: Displays error message to user

## Security
- Admin-only access (requires ADMIN role)
- All operations logged in audit trail
- Property ownership validation
- Input sanitization and validation

## Future Enhancements
- [ ] Property editing interface
- [ ] Batch operations (bulk approve/reject)
- [ ] Property duplication detection
- [ ] Image upload during creation
- [ ] Property preview before approval
- [ ] Export properties to CSV
- [ ] Property analytics dashboard
- [ ] Automated property verification
