# Flag Explorer Frontend

A modern, responsive web application built with Next.js and TailwindCSS that displays country flags and detailed information about countries around the world.

## Features

- **Home Screen**: Grid layout displaying all country flags with search functionality
- **Detail Screen**: Comprehensive country information including name, capital, population, and area
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations and transitions
- **Search Functionality**: Real-time search to find countries quickly
- **Image Optimization**: Efficient loading and display of flag images

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **React 19**: Latest React features
- **Jest**: Testing framework
- **Testing Library**: React component testing utilities

## Setup and Installation

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

## Running the Application

### Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── country/[name]/
│   │   │   └── page.tsx      # Country detail page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable components
│   ├── lib/
│   │   └── api.ts           # API utility functions
│   └── types/
│       └── country.ts       # TypeScript type definitions
├── __tests__/               # Test files
├── public/                  # Static assets
├── jest.config.js          # Jest configuration
├── jest.setup.js           # Jest setup
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Integration

The frontend integrates with:
- **Backend API**: Custom FastAPI backend for country data
- **RestCountries API**: External API for flag images and basic country information

## Features in Detail

### Home Screen
- Grid layout of country flags
- Search functionality to filter countries
- Responsive design that adapts to different screen sizes
- Hover effects and smooth transitions
- Loading states and error handling

### Detail Screen
- Large flag display
- Comprehensive country information
- Back navigation
- Responsive layout
- Error handling for missing countries

## Styling

The application uses TailwindCSS for styling with:
- Responsive design utilities
- Custom color palette
- Smooth animations and transitions
- Modern UI components
- Accessibility considerations

## Performance Optimizations

- Next.js Image component for optimized image loading
- Static generation where possible
- Efficient API calls with proper error handling
- Responsive images with appropriate sizing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure responsive design works across devices
4. Update documentation as needed
5. Test thoroughly before submitting changes
