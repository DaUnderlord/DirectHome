# DirectHome Real Estate Platform

DirectHome is a web application designed to revolutionize the Nigerian rental property market by directly connecting property seekers with homeowners, eliminating the need for agents and middlemen. The platform aims to provide a transparent, efficient, and cost-effective solution for finding rental accommodations in Nigeria.

## Features

- **User Authentication**: Secure registration and login with role-based access (Home Owner, Home Seeker, Admin)
- **Property Listings**: Comprehensive property listings with detailed information and media
- **Search & Discovery**: Advanced search and filtering capabilities for finding properties
- **Direct Communication**: Messaging system for direct communication between property owners and seekers
- **Appointment Scheduling**: Tools for scheduling and managing property viewings
- **Favorites & Saved Searches**: Save favorite properties and search criteria
- **Trust & Verification**: Verification mechanisms for users and properties
- **Mobile Responsive**: Fully responsive design for all devices

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **UI Components**: Mantine UI
- **State Management**: Zustand
- **Routing**: React Router v6
- **Form Management**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/directhome.git
cd directhome
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
directhome/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   │   ├── Auth/        # Authentication components
│   │   ├── Layout/      # Layout components
│   │   ├── Property/    # Property-related components
│   │   └── UI/          # Basic UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── routes/          # Route definitions
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── validations/     # Form validation schemas
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
├── .env.example         # Example environment variables
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## State Management

The application uses Zustand for state management with the following stores:

### Property Store

The property store manages all property-related state including:

- Property listings
- Current property details
- Search filters and results
- Pagination state

```typescript
// Example usage
import { usePropertyStore } from './store';

const { 
  properties, 
  fetchProperties, 
  searchFilters, 
  setSearchFilters 
} = usePropertyStore();
```

### Favorites Store

The favorites store manages user favorites and recently viewed properties:

- Add/remove favorites
- Toggle favorite status
- Track recently viewed properties

```typescript
// Example usage
import { useFavoritesStore } from './store';

const { 
  favorites, 
  toggleFavorite, 
  isFavorite 
} = useFavoritesStore();
```

## Custom Hooks

The application provides several custom hooks for common functionality:

### useProperty

For managing individual property operations:

```typescript
const { 
  property, 
  isLoading, 
  fetchProperty, 
  updateProperty 
} = useProperty(propertyId);
```

### usePropertySearch

For property search functionality:

```typescript
const { 
  properties, 
  searchFilters, 
  isLoading, 
  search, 
  applyFilter 
} = usePropertySearch();
```

### usePropertyFavorites

For managing property favorites:

```typescript
const { 
  favorites, 
  toggleFavorite, 
  isFavorite, 
  markAsViewed 
} = usePropertyFavorites();
```

### usePropertyFilters

For managing property search filters:

```typescript
const { 
  filters, 
  updateFilter, 
  applyFilters, 
  resetAllFilters 
} = usePropertyFilters();
```

## Components

### Property Components

- **PropertyCard**: Displays a property with key information and image
- **PropertyGrid**: Displays a grid of properties with filtering and pagination
- **FeaturedProperties**: Displays featured properties
- **FavoriteProperties**: Displays user's favorite properties

### UI Components

- **Button**: Customizable button component
- **Card**: Container component for content
- **Input**: Form input component
- **Select**: Dropdown select component
- **Badge**: Label component for status indicators
- **Spinner**: Loading indicator component

## Development

### Mock Data

During development, the application uses mock data services to simulate API responses. This allows for development without a backend.

### API Service

The API service provides methods for interacting with the backend:

```typescript
import { propertyService } from './services/api';

// Get properties with filters
const response = await propertyService.getProperties({ 
  propertyType: 'house',
  minPrice: 100000
});

// Get a single property
const property = await propertyService.getProperty('123');
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.