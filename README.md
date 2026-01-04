# ResearchAI - AI-Powered Research Agent

ResearchAI is a modern web application that leverages artificial intelligence to conduct comprehensive research on any topic. Get detailed insights, images, videos, and credible sources — then export your research as PDF or Word documents.

![ResearchAI Screenshot](https://www.linkedin.com/in/shankar-magar-725b671b7/overlay/projects/586726128/multiple-media-viewer/?profileId=ACoAADKKDU0BlJ-44AQeQ5hGQTyxEWujOyMj8go&treasuryMediaId=1766886536330)

## ✨ Features

### Core Functionality

- **AI-Powered Research**: Enter any topic and receive comprehensive research results
- **Streaming Responses**: Real-time AI responses as they're generated
- **Research History**: Keep track of your past research queries with a sidebar history
- **Multi-format Export**: Export research results as PDF or Word documents

### User System

- **Authentication**: Full authentication system with email/password
- **User Profiles**: Personalized experience with user-specific research history
- **Subscription Management**: Manage your subscription and billing

### Subscription Tiers

| Plan           | Price     | Monthly Research | Features                                                            |
| -------------- | --------- | ---------------- | ------------------------------------------------------------------- |
| **Free**       | $0/month  | 5 researches     | Basic export (PDF), Standard AI model                               |
| **Pro**        | $19/month | 50 researches    | All export formats, Priority AI processing, Research history        |
| **Enterprise** | $49/month | Unlimited        | All export formats, Priority support, Custom AI prompts, API access |

### Modern UI/UX

- **Beautiful Interface**: Clean, modern design with dark mode support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Polished animations and transitions
- **Toast Notifications**: Informative feedback for user actions

## 🏗️ Architecture

```
AIresearch/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (shadcn/ui)
│   │   ├── ExportDialog.tsx # Export research to PDF/Word
│   │   ├── HistorySidebar.tsx # Research history sidebar
│   │   ├── LoadingState.tsx # Loading animation component
│   │   ├── ResearchResult.tsx # Research results display
│   │   ├── SearchInput.tsx  # Search bar component
│   │   └── UserMenu.tsx     # User menu dropdown
│   ├── hooks/
│   │   ├── useAuth.tsx      # Authentication context and hooks
│   │   ├── useResearch.tsx  # Research API integration
│   │   ├── useSubscription.tsx # Subscription management
│   │   └── use-toast.tsx    # Toast notification system
│   ├── integrations/
│   │   └── supabase/        # Supabase client configuration
│   ├── pages/
│   │   ├── Auth.tsx         # Authentication page
│   │   ├── index.tsx        # Home/Research page
│   │   ├── NotFound.tsx     # 404 page
│   │   └── Pricing.tsx      # Pricing page
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── supabase/
│   └── functions/           # Edge functions
│       ├── check-subscription/  # Verify Stripe subscription
│       ├── create-checkout/     # Create Stripe checkout
│       ├── customer-portal/     # Stripe customer portal
│       └── stripe-webhook/      # Handle Stripe webhooks
├── public/                  # Static assets
├── package.json
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Lucide React** - Beautiful icons

### Backend & Services

- **Supabase** - Backend-as-a-Service
  - Authentication
  - Database (PostgreSQL)
  - Edge Functions
  - Real-time subscriptions
- **Stripe** - Payment processing
- **OpenAI** - AI research generation

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic vendor prefixes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- OpenAI API key

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Stripe (optional - for payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# OpenAI (for edge functions)
OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd AIresearch
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

### Components

The application uses a modular component architecture:

- **UI Components** (`src/components/ui/`): Reusable, accessible UI elements built with Radix UI primitives
- **Feature Components**: Specialized components for specific features
  - `ResearchResult`: Displays research content with markdown support
  - `ExportDialog`: Handles PDF and Word export
  - `HistorySidebar`: Shows research history
  - `SearchInput`: Search bar with keyboard shortcuts

### Hooks

Custom React hooks for logic separation:

- `useAuth`: Authentication state and methods
- `useResearch`: Research API integration with streaming support
- `useSubscription`: Subscription and plan management
- `use-toast`: Toast notification system

### Pages

- **Home** (`/`): Main research interface
- **Auth** (`/auth`): Sign in and sign up
- **Pricing** (`/pricing`): Subscription plans
- **NotFound** (`*`): 404 error page

### Edge Functions

Supabase Edge Functions handle server-side logic:

- `research`: AI research generation with OpenAI
- `create-checkout`: Stripe checkout session creation
- `customer-portal`: Stripe billing portal access
- `check-subscription`: Verify subscription status
- `stripe-webhook`: Handle Stripe webhook events

## 🔒 Authentication

ResearchAI uses Supabase Auth for user authentication:

- **Email/Password**: Traditional email and password authentication
- **Session Management**: Automatic session refresh and persistence
- **Protected Routes**: Authentication required for research features

### Auth Functions

```typescript
signUp(email, password, fullName); // Create new account
signIn(email, password); // Sign in to existing account
signOut(); // Sign out current user
```

## 💳 Subscriptions & Payments

### Stripe Integration

The application integrates with Stripe for subscription management:

1. **Checkout**: Users can upgrade from the Pricing page
2. **Customer Portal**: Manage subscriptions, update payment methods
3. **Webhooks**: Automatic subscription status updates
4. **Usage Tracking**: Monthly research count tracking

### Plan Limits

| Plan       | Monthly Limit | Features                |
| ---------- | ------------- | ----------------------- |
| Free       | 5 researches  | Basic functionality     |
| Pro        | 50 researches | All features + priority |
| Enterprise | Unlimited     | Everything + API access |

## 📤 Export Functionality

ResearchAI supports exporting research results in multiple formats:

### PDF Export

- Opens browser print dialog
- Styled for professional printing
- Includes timestamp and branding

### Word Export

- Downloads as .doc file
- Compatible with Microsoft Word
- Editable format for further customization

## 🎨 Customization

### Theming

The application uses CSS variables for theming. Customize in `src/index.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #09090b;
  --primary: #6366f1;
  /* ... more variables */
}
```

### Adding New Plans

To add a new subscription plan:

1. Update `PLANS` in `src/hooks/useSubscription.tsx`
2. Create Stripe product and price
3. Add price ID to the plan configuration
4. Update database schema if needed

### Adding Export Formats

To add new export formats:

1. Add format option in `ExportDialog.tsx`
2. Implement export function
3. Add button styling and icons

## 🧪 Development

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable names

### Adding New Features

1. Create component in appropriate directory
2. Add hooks for business logic
3. Integrate with existing pages
4. Add TypeScript types
5. Write unit tests (optional)

### Database Schema

Key tables in Supabase:

```sql
-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT,
  research_count INTEGER DEFAULT 0,
  monthly_limit INTEGER DEFAULT 5,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT
);
```

## 📝 API Reference

### Research Edge Function

**Endpoint**: `/functions/v1/research`

**Method**: POST

**Headers**:

```
Authorization: Bearer {supabase_publishable_key}
Content-Type: application/json
```

**Body**:

```json
{
  "topic": "Your research topic"
}
```

**Response**: Streaming SSE response with AI-generated content

### Subscription Functions

- `create-checkout`: Creates Stripe checkout session
- `customer-portal`: Creates Stripe billing portal URL
- `check-subscription`: Verifies current subscription status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for the excellent backend services
- [OpenAI](https://openai.com/) for AI capabilities
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
