# Design Document

## Overview

The Property Listing Onboarding Flow implements a dashboard-centric approach to property management with role-based navigation. This design ensures that only verified property owners can list properties while providing a seamless user experience. The system adapts navigation options based on authentication status and user roles, centralizes property management in role-specific dashboards, and implements verification processes to maintain listing quality and user trust.

## Architecture

### Component Structure

The implementation will follow a modular approach with the following key components:

1. **Header Navigation Component**
   - Adapts navigation options based on authentication status and user roles
   - Displays either "List Your Property" or "Dashboard" button as appropriate

2. **Dashboard Components**
   - Home Seeker Dashboard with option to become a property owner
   - Home Owner Dashboard with property management features
   - Role Switcher for users with dual roles

3. **Verification Components**
   - Owner Verification Flow
   - Document Upload Interface
   - Verification Status Display

4. **Role Conversion Components**
   - Role Conversion Flow
   - Information Collection Forms
   - Confirmation and Success States

### Data Flow

```
+-------------------+     +-------------------+     +-------------------+
| Header Navigation |---->| Authentication    |---->| Role-Based        |
| Component         |     | Check             |     | Redirection       |
+-------------------+     +-------------------+     +-------------------+
                                                            |
                                                            v
+-------------------+     +-------------------+     +-------------------+
| Property Listing  |<----| Verification      |<----| Role-Specific     |
| Form              |     | Status Check      |     | Dashboard         |
+-------------------+     +-------------------+     +-------------------+
```

### State Management

The application will use Zustand for state management with the following stores:

1. **Auth Store** (existing)
   - User authentication status
   - User role information
   - Profile data

2. **Verification Store** (new)
   - Verification status
   - Document submission status
   - Verification history

3. **Dashboard Store** (new)
   - Dashboard view preferences
   - Property listing metrics
   - Notification status

## Components and Interfaces

### Header Navigation Component

The Header component will be updated to conditionally render navigation options based on authentication status:

```typescript
// Simplified pseudo-code
const Header = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <header>
      <Logo />
      <nav>
        {isAuthenticated ? (
          <Link to="/dashboard">Dashboard</Link>
        ) : (
          <Link to="/auth/login?redirect=list-property">List Your Property</Link>
        )}
        {/* Other navigation items */}
      </nav>
    </header>
  );
};
```

### Dashboard Components

#### Dashboard Router

A dashboard router component will direct users to the appropriate dashboard based on their role:

```typescript
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (user?.role === UserRole.HOME_OWNER || 
      (Array.isArray(user?.roles) && user.roles.includes(UserRole.HOME_OWNER))) {
    return <HomeOwnerDashboard />;
  }
  
  return <HomeSeekerDashboard />;
};
```

#### Home Owner Dashboard

The home owner dashboard will include property management features:

```typescript
const HomeOwnerDashboard = () => {
  const { verificationStatus } = useVerification();
  
  return (
    <div>
      <h1>Home Owner Dashboard</h1>
      
      {/* Property Listing Button */}
      <PropertyListingButton 
        verificationStatus={verificationStatus} 
      />
      
      {/* Property Listings */}
      <PropertyListings />
      
      {/* Dashboard Metrics */}
      <DashboardMetrics />
    </div>
  );
};
```

#### Home Seeker Dashboard

The home seeker dashboard will include an option to become a property owner:

```typescript
const HomeSeekerDashboard = () => {
  return (
    <div>
      <h1>Home Seeker Dashboard</h1>
      
      {/* Saved Properties */}
      <SavedProperties />
      
      {/* Become a Property Owner */}
      <BecomePropertyOwnerCard />
    </div>
  );
};
```

### Verification Components

#### Owner Verification Flow

A multi-step verification process for property owners:

```typescript
const OwnerVerificationFlow = () => {
  const [step, setStep] = useState(1);
  
  return (
    <div>
      <h1>Owner Verification</h1>
      
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={step} totalSteps={3} />
      
      {/* Step Content */}
      {step === 1 && <VerificationIntro onNext={() => setStep(2)} />}
      {step === 2 && <DocumentUpload onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <VerificationSubmission onBack={() => setStep(2)} />}
    </div>
  );
};
```

#### Verification Status Component

A component to display the current verification status:

```typescript
const VerificationStatus = ({ status }) => {
  return (
    <div className={`verification-status ${status.toLowerCase()}`}>
      {status === 'PENDING' && (
        <>
          <IconClock />
          <p>Verification in progress. Estimated completion: 1-2 business days.</p>
        </>
      )}
      
      {status === 'VERIFIED' && (
        <>
          <IconCheck />
          <p>Your account is verified. You can now list properties.</p>
        </>
      )}
      
      {status === 'REJECTED' && (
        <>
          <IconX />
          <p>Verification rejected. Please review feedback and resubmit.</p>
          <Button>View Feedback</Button>
        </>
      )}
    </div>
  );
};
```

### Role Conversion Components

#### Become Property Owner Card

A card component to initiate the role conversion process:

```typescript
const BecomePropertyOwnerCard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="card">
      <h2>Want to list your property?</h2>
      <p>Become a property owner to list your properties on DirectHome.</p>
      <Button onClick={() => navigate('/role-conversion')}>
        Become a Property Owner
      </Button>
    </div>
  );
};
```

#### Role Conversion Flow

A multi-step process to convert a home seeker to a property owner:

```typescript
const RoleConversionFlow = () => {
  const [step, setStep] = useState(1);
  
  return (
    <div>
      <h1>Become a Property Owner</h1>
      
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={step} totalSteps={3} />
      
      {/* Step Content */}
      {step === 1 && <RoleConversionIntro onNext={() => setStep(2)} />}
      {step === 2 && <OwnerInformationForm onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <RoleConversionConfirmation onBack={() => setStep(2)} />}
    </div>
  );
};
```

## User Flows

### Unauthenticated User Flow

```mermaid
graph TD
    A[User visits site] --> B[Sees "List Your Property" button]
    B --> C[Clicks button]
    C --> D[Redirected to login page]
    D --> E[Login with credentials]
    E --> F[Redirected to appropriate dashboard]
```

### Home Seeker to Property Owner Conversion Flow

```mermaid
graph TD
    A[Home Seeker logs in] --> B[Navigates to Dashboard]
    B --> C[Clicks "Become a Property Owner"]
    C --> D[Views role conversion information]
    D --> E[Completes owner information form]
    E --> F[Confirms role conversion]
    F --> G[Redirected to verification flow]
    G --> H[Completes verification]
    H --> I[Accesses Home Owner Dashboard]
```

### Property Listing Flow for Verified Owner

```mermaid
graph TD
    A[Home Owner logs in] --> B[Navigates to Dashboard]
    B --> C[Clicks "List New Property"]
    C --> D[System checks verification status]
    D --> E{Is verified?}
    E -- Yes --> F[Redirected to property listing form]
    E -- No --> G[Redirected to verification flow]
    F --> H[Completes property listing form]
    H --> I[Property submitted for review]
```

## Error Handling

### Authentication Errors

- If authentication fails during login, display specific error messages based on the error type
- Provide password recovery options for users who cannot log in
- Maintain the intended redirect path through the authentication process

### Verification Errors

- Handle document upload failures with retry options
- Provide clear feedback for rejected verifications
- Implement a grace period for resubmission after rejection

### Form Validation

- Implement client-side validation for all forms with immediate feedback
- Provide field-specific error messages
- Preserve form data on navigation or page refresh to prevent data loss

## Testing Strategy

### Unit Tests

- Test conditional rendering in Header component based on authentication state
- Test role-based routing in Dashboard components
- Test verification status checks and redirects

### Integration Tests

- Test the complete flow from unauthenticated user to property listing
- Test role conversion process
- Test verification submission and status updates

### User Acceptance Testing

- Test with different user types (anonymous, home seeker, home owner)
- Test with different verification statuses
- Test edge cases like session expiration during the process

## Implementation Plan

The implementation will be phased to minimize disruption:

1. **Phase 1: Header Navigation Updates**
   - Update Header component to show conditional navigation
   - Implement authentication redirects

2. **Phase 2: Dashboard Enhancements**
   - Create or update Home Owner Dashboard
   - Create or update Home Seeker Dashboard
   - Implement dashboard routing

3. **Phase 3: Verification Flow**
   - Implement verification components
   - Create verification store
   - Connect verification status to property listing access

4. **Phase 4: Role Conversion**
   - Implement role conversion flow
   - Connect role conversion to verification flow
   - Update user roles in auth store