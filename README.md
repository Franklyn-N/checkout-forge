# CheckoutForge

A modern checkout page builder and sales funnel platform built with React, TypeScript, and Supabase.

## Features

- Custom checkout page builder
- A/B testing and conversion optimization
- Affiliate management system
- Sales funnel builder
- Product and order management
- Real-time analytics dashboard

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS 3.4
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite 5

## Project Structure

```
project/
├── client/                    # Main application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (Auth, etc.)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   └── ...config files
├── supabase/
│   └── migrations/           # Database migrations
└── ...root config files
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd client
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Development

Start the development server:
```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
cd client
npm run build
```

The production build will be in the `dist/` directory.

### Code Quality

```bash
# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Check TypeScript types

## Environment Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_API_URL` - Optional API URL (defaults to Supabase)

## Database

The application uses Supabase (PostgreSQL) with the following main tables:
- `products` - Product catalog
- `orders` - Customer orders
- `checkout_pages` - Custom checkout configurations
- `affiliates` - Affiliate partners
- `ab_tests` - A/B testing experiments
- `funnels` - Sales funnel definitions

Database migrations are located in `supabase/migrations/`.

## License

Private - All rights reserved
