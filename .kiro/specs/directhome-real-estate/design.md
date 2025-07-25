# Design Document

## Overview

DirectHome is a modern, responsive web application built with React that connects Nigerian property seekers directly with homeowners. The platform emphasizes a premium user experience through elegant UI components, intuitive navigation, and mobile-first design principles. The architecture prioritizes performance, scalability, and user trust while maintaining the core value proposition of eliminating intermediaries in the rental market.

## Architecture

### Technology Stack

**Frontend Framework**: React 18+ with TypeScript for type safety and better developer experience

**UI Component Library**: Mantine UI - chosen for its comprehensive component set, excellent TypeScript support, built-in dark mode, and professional appearance suitable for a premium real estate platform

**State Management**: Zustand for lightweight, scalable state management with TypeScript support

**Routing**: React Router v6 for client-side navigation and protected routes

**Form Management**: React Hook Form with Zod validation for type-safe form handling

**Image Handling**: React Image Gallery for property photos with lazy loading and optimization

**Maps Integration**: Mapbox GL JS for interactive property location mapping

**Real-time Communication**: Socket.io client for instant messaging and notifications

**HTTP Client**: Axios with interceptors for API communication and error handling

**Styling**: Mantine's built-in styling system with CSS-in-JS and custom theme configuration

**Build Tool**: Vite for fast development and optimized production builds


### System Architecture

`
+-----------------+    +-----------------+    +-----------------+
¦   React Client  ¦    ¦   API Gateway   ¦    ¦   Supabase      ¦
¦                 ¦    ¦                 ¦    ¦                 ¦
¦ • Components    ¦?--?¦ • Authentication¦?--?¦ • Database      ¦
¦ • State Mgmt    ¦    ¦ • Rate Limiting ¦    ¦ • Auth          ¦
¦ • Routing       ¦    ¦ • Validation    ¦    ¦ • Storage       ¦
¦ • UI Library    ¦    ¦ • Logging       ¦    ¦ • Real-time     ¦
+-----------------+    +-----------------+    +-----------------+
         ¦                       ¦                       ¦
         ¦              +-----------------+              ¦
         +--------------?¦  External APIs  ¦?-------------+
                         ¦                 ¦
                         ¦ • Mapbox        ¦
                         ¦ • Payment Gateways
                         ¦ • SMS Services  ¦
                         +-----------------+
`

## Components and Interfaces

### Core Layout Components

**AppShell**: Main application wrapper using Mantine's AppShell component
- Header with navigation, user menu, and notifications
- Responsive sidebar for mobile navigation
- Footer with company information and links
- Consistent spacing and theming throughout

**Navigation**: Adaptive navigation system
- Desktop: Horizontal navigation bar with dropdowns
- Mobile: Collapsible hamburger menu with slide-out drawer
- Breadcrumb navigation for deep pages
- Active state indicators and smooth transitions

### Authentication Components

**AuthLayout**: Centered authentication wrapper with branding
- Split-screen design with hero image and form
- Responsive layout that adapts to mobile screens
- Consistent styling across login, register, and verification pages

**LoginForm**: Secure login interface
- Email/phone and password fields with validation
- Remember me checkbox and Forgot password link
- Social login options (Google, Facebook) for convenience
- Loading states and error handling

**RegisterForm**: Multi-step registration process
- Step 1: Basic information (name, email, phone, password)
- Step 2: Role selection (homeowner/home seeker) with visual cards
- Step 3: Profile completion with optional fields
- Progress indicator and form validation at each step

**VerificationScreen**: Email and phone verification
- Code input with auto-focus and paste support
- Resend functionality with countdown timer
- Clear instructions and success/error states


### Property Management Components

**PropertyListingForm**: Comprehensive property creation interface
- Multi-step wizard with progress tracking
- Step 1: Basic details (title, description, type, price)
- Step 2: Location with map picker and address autocomplete
- Step 3: Property features with checkbox groups and counters
- Step 4: Image upload with drag-and-drop, preview, and reordering
- Step 5: Review and publish with terms acceptance
- Auto-save functionality and validation feedback

**PropertyCard**: Reusable property display component
- High-quality image carousel with navigation dots
- Price prominently displayed with currency formatting
- Key details (bedrooms, bathrooms, area) with icons
- Location with distance from user (if available)
- Favorite button with heart animation
- Hover effects and smooth transitions
- Responsive design for grid layouts

**PropertyGallery**: Full-screen image viewer
- Lightbox-style gallery with thumbnail navigation
- Zoom functionality and full-screen mode
- Touch/swipe support for mobile devices
- Image loading states and error handling

### Search and Discovery Components

**SearchBar**: Intelligent search interface
- Location autocomplete with Nigerian cities/areas
- Quick filters (price range, property type, bedrooms)
- Search suggestions and recent searches
- Voice search capability for mobile users

**FilterPanel**: Advanced filtering system
- Collapsible sections for different filter categories
- Price range slider with currency formatting
- Multi-select dropdowns for amenities and features
- Map boundary filtering integration
- Clear all filters and active filter indicators
- Mobile-optimized drawer layout

**PropertyGrid**: Responsive property listing display
- Masonry or grid layout options
- Infinite scroll or pagination
- Sort options (price, date, relevance, distance)
- Loading skeletons and empty states
- List/grid view toggle

**MapView**: Interactive property map
- Clustered markers for better performance
- Property preview cards on marker hover/click
- Draw search area functionality
- Layer controls (satellite, street view)
- Mobile-optimized touch controls


### Communication Components

**MessageCenter**: Real-time messaging interface
- Conversation list with unread indicators
- Message threads with property context
- File and image sharing capabilities
- Typing indicators and read receipts
- Message search and filtering
- Mobile-optimized chat interface

**AppointmentScheduler**: Viewing appointment management
- Calendar view with available time slots
- Booking form with date/time picker
- Confirmation and reminder system
- Rescheduling and cancellation options
- Integration with user's calendar

### User Profile Components

**ProfileDashboard**: Role-specific dashboard
- Homeowner: Property management, inquiries, appointments
- Home Seeker: Saved properties, search alerts, viewing history
- Quick stats and recent activity
- Action shortcuts and notifications

**ProfileSettings**: User account management
- Personal information editing with validation
- Password change with security requirements
- Notification preferences with granular controls
- Account verification status and actions
- Privacy settings and data management

### Admin Components

**AdminDashboard**: Comprehensive platform oversight
- Key metrics with charts and graphs
- Recent activity feed and alerts
- Quick actions for common tasks
- System health indicators

**ModerationPanel**: Content review and management
- Pending listings queue with preview
- User reports and dispute resolution
- Bulk actions and filtering options
- Approval workflow with comments

### Message Model
```typescript
interface Conversation {
  id: string;
  participants: string[];
  propertyId?: string;
  lastMessage: Message;
  unreadCount: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'appointment';
  attachments?: MessageAttachment[];
  readBy: Record<string, Date>;
  createdAt: Date;
}
```

## Error Handling

### Client-Side Error Handling

**Global Error Boundary**: React Error Boundary component to catch and display user-friendly error messages

**API Error Handling**: Centralized error handling with Axios interceptors
- Network errors with retry functionality
- Authentication errors with automatic logout
- Validation errors with field-specific messages
- Rate limiting with user-friendly notifications

**Form Validation**: Real-time validation with Zod schemas
- Field-level validation with immediate feedback
- Form-level validation before submission
- Custom validation rules for Nigerian phone numbers and addresses

**Image Upload Errors**: Comprehensive error handling for media uploads
- File size and format validation
- Upload progress and cancellation
- Retry mechanism for failed uploads
- Fallback images for broken links

### User Experience Error States

**Loading States**: Skeleton screens and loading indicators for all async operations

**Empty States**: Meaningful empty state designs with actionable suggestions
- No search results with filter adjustment suggestions
- Empty property lists with creation prompts
- No messages with conversation starters

**Offline Handling**: Service worker for basic offline functionality
- Cached property data for browsing
- Offline form submission queue
- Network status indicators

## Testing Strategy

### Component Testing
- Unit tests for all reusable components using React Testing Library
- Visual regression testing with Storybook and Chromatic
- Accessibility testing with jest-axe and manual testing

### Integration Testing
- End-to-end user flows with Playwright
- API integration testing with mock service worker
- Cross-browser compatibility testing

### Performance Testing
- Lighthouse audits for performance, accessibility, and SEO
- Bundle size monitoring and optimization
- Image optimization and lazy loading verification

### User Acceptance Testing
- Usability testing with target Nigerian users
- Mobile device testing on various screen sizes
- Network condition testing (slow 3G, offline scenarios)

## UI/UX Design Principles

### Visual Design
**Color Palette**: Professional and trustworthy color scheme
- Primary: Deep blue (#1B365D) for trust and stability
- Secondary: Warm orange (#FF6B35) for energy and action
- Success: Green (#28A745) for positive actions
- Warning: Amber (#FFC107) for cautions
- Error: Red (#DC3545) for errors and alerts

**Typography**: Clear, readable font hierarchy
- Headings: Inter font family for modern, professional look
- Body text: System fonts for optimal performance and readability
- Consistent spacing and line heights for readability

**Imagery**: High-quality, consistent image treatment
- Property images with consistent aspect ratios
- Image optimization for fast loading
- Placeholder images with branded styling

### Responsive Design
**Mobile-First Approach**: Design and develop for mobile devices first
- Touch-friendly interface elements (minimum 44px touch targets)
- Optimized navigation for thumb-friendly interaction
- Reduced data usage for Nigerian mobile networks

**Breakpoint Strategy**:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Accessibility
**WCAG 2.1 AA Compliance**: Ensure platform is accessible to users with disabilities
- Proper heading hierarchy and semantic HTML
- Alt text for all images and icons
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios meeting accessibility standards

**Internationalization Ready**: Structure for future localization
- Text externalization for easy translation
- RTL language support preparation
- Cultural considerations for Nigerian users

### Performance Optimization
**Core Web Vitals**: Optimize for Google's performance metrics
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

**Optimization Strategies**:
- Code splitting and lazy loading
- Image optimization and WebP format support
- CDN integration for static assets
- Service worker for caching strategies
- Bundle size monitoring and tree shaking
