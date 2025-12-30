# NextLevel Food

A platform for food enthusiasts to share recipes, discover new dishes, and connect with other food lovers.

## 📋 Project Overview

NextLevel Food is a web application that allows users to:
- Share their favorite recipes with the world
- Discover new dishes from other food enthusiasts
- Connect with like-minded people in the food community
- Participate in exclusive food-related events
- **Sign in with Google to manage your recipes**

## 🔐 Authentication

The application uses **NextAuth.js** with Google OAuth provider for authentication. Users can:
- Sign in with their Google account
- Automatically fill in their name and email when creating recipes
- Have their recipes associated with their email address
- Edit and delete their own recipes
- Sign out when done

### Using the useAuth Hook

The application provides a custom `useAuth()` hook for accessing authentication state in client components:

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, isAdmin, userEmail, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  
  return <div>Hello, {userEmail}!</div>;
}
```

**Available properties:**
- `session` - Full session object
- `isAuthenticated` - Whether user is signed in
- `isAdmin` - Whether user has admin privileges
- `userEmail` - User's email address
- `userName` - User's display name
- `isLoading` - Whether session is being loaded

For detailed usage examples, see [REFACTORING_USE_AUTH.md](./REFACTORING_USE_AUTH.md).

### Administrator Access

Administrators have additional privileges:
- **Edit any recipe** (not just their own)
- **Delete any recipe** (not just their own)

To set up an administrator account, see the [Admin Setup Guide](./ADMIN_SETUP.md).

Quick setup:
```bash
# 1. Run migrations (one time only)
npm run migrate

# 2. Create an admin user
npm run make-admin your-email@example.com

# 3. Sign out and sign in again to apply admin rights
```

**Important:** After creating an admin user, you must sign out and sign in again for the changes to take effect.

For troubleshooting admin rights, see [ADMIN_FIX.md](./ADMIN_FIX.md).

#### Docker Deployment

When running in Docker, migrations run automatically on container startup. To create an admin:

```bash
# Create admin in running container
docker exec fdc-app node scripts/make-admin.js your-email@example.com

# View all admins
docker exec fdc-app sqlite3 /data/meals.db "SELECT email, is_admin FROM users WHERE is_admin = 1;"
```

For detailed Docker instructions, see:
- [DOCKER.md](./DOCKER.md) - Complete Docker guide
- [DOCKER_ADMIN_QUICK_REF.md](./DOCKER_ADMIN_QUICK_REF.md) - Quick reference for admin commands in Docker

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
6. Copy the Client ID and Client Secret
7. Create a `.env.local` file in the root directory (see `.env.example`)
8. Add your credentials:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```


## 🚀 Technologies Used

- **Frontend**: 
  - [Next.js 15](https://nextjs.org/) - React framework with App Router
  - [React 19](https://react.dev/) - UI library
  - [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
  - CSS Modules - For component-scoped styling

- **Authentication**:
  - [NextAuth.js v5](https://next-auth.js.org/) - Authentication for Next.js
  - Google OAuth 2.0 - Sign in with Google

- **Database**:
  - [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - SQLite database

- **Testing**:
  - [Jest](https://jestjs.io/) - Testing framework
  - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - React component testing
  - [jest-dom](https://github.com/testing-library/jest-dom) - Custom DOM element matchers

- **Development Tools**:
  - [ESLint](https://eslint.org/) - Code linting
  - [Prettier](https://prettier.io/) - Code formatting

## 🗂️ Project Structure

```
next.level.food/
├── app/                  # Next.js App Router pages
│   ├── community/        # Community page
│   ├── meals/            # Meals listing and details
│   ├── __tests__/        # Page tests
│   └── layout.tsx        # Root layout with metadata
├── assets/               # Static assets (images, icons)
├── components/           # Reusable React components
│   ├── ImageSlideshow/   # Image slideshow component
│   ├── MainHeader/       # Main header with navigation
│   ├── Meals/            # Meal-related components
│   │   ├── MealItem/     # Individual meal component with tests
│   │   └── MealsGrid/    # Grid layout for meals with tests
│   ├── NavLink/          # Navigation link component
│   └── __tests__/        # Component tests
├── lib/                  # Utility functions and data access
│   └── meals.ts          # Meal data access functions
├── public/               # Public static files
├── types/                # TypeScript type definitions
│   └── meals.ts          # Meal-related type definitions
└── __mocks__/            # Test mocks
```

### Components and Types

#### Meal-Related Components

- **MealItem**: A component that displays a single meal with its title, image, summary, and creator. It also provides a link to the meal details page.
- **MealsGrid**: A component that displays a grid of meal items. It takes an array of meal objects and renders a MealItem component for each meal.

#### Type Definitions

The project uses TypeScript for type safety. The following types are defined in the `types/meals.ts` file:

- **Meal**: An interface that represents a meal item with properties like id, title, slug, image, summary, and creator.
- **MealItemProps**: A type that represents the props for the MealItem component. It's derived from the Meal interface but omits the id property.
- **MealsGridProps**: An interface that represents the props for the MealsGrid component. It includes an array of Meal objects.

## 🛠️ Installation

### Prerequisites (Windows)

For Windows users, better-sqlite3 requires:
- **Python** (3.x) - [Download](https://www.python.org/downloads/)
- **Visual Studio Build Tools** - [Download](https://visualstudio.microsoft.com/downloads/)
  - Make sure to install "Desktop development with C++" workload
- **Node.js** 18+ - [Download](https://nodejs.org/)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/GyGaByyyTe/next.level.food.git
   cd next.level.food
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```
   
   **Note**: The project uses pnpm. If you don't have it installed:
   ```bash
   npm install -g pnpm
   ```

3. Create `.env.local` file (see Authentication section above)

### Troubleshooting better-sqlite3

If you encounter errors like "Could not locate the bindings file", see [BETTER_SQLITE3_FIX.md](./BETTER_SQLITE3_FIX.md) for detailed solution.

The project includes `.npmrc` configuration that automatically handles native module compilation with Visual Studio 2019.

## 🖥️ Usage

### First Time Setup

If you're setting up the project for the first time or after updating to a version with admin features:

1. **Run database migrations:**
   ```bash
   npm run migrate
   ```

2. **Create an admin user (optional):**
   ```bash
   npm run make-admin your-email@example.com
   ```
### Development

Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

Build the application for production:
```bash
pnpm build
```

Start the production server:
```bash
pnpm start
```

## 🧪 Testing

The project includes comprehensive tests for components and pages.

Run all tests:
```bash
pnpm test
```

Run tests in watch mode (useful during development):
```bash
pnpm test:watch
```

### Component and Library Tests

The project includes tests for the following components and library functions:

- **MealItem**: Tests that the component renders correctly with all meal properties (title, image, summary, creator) and that the link to the meal details page works.
- **MealsGrid**: Tests that the component renders a list of meal items correctly and handles empty lists.
- **lib/meals**: Tests for the `getMeals()` function that retrieves meal data from the database.

For more information about testing, see the [testing documentation](./__tests__/README.md).

## 📦 Deployment

The application can be deployed on [Vercel](https://vercel.com/), the platform from the creators of Next.js:

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure the build settings

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### Docker Deployment

The application can be deployed using Docker for production environments.

#### Quick Start

```bash
# Build and push image (from development machine)
docker build -t gygabyyyte/food-does-cool:latest .
docker push gygabyyyte/food-does-cool:latest

# Deploy on server
docker compose -f docker-compose.app.yml pull
docker compose -f docker-compose.app.yml up -d

# Create admin user
docker exec fdc-app node scripts/make-admin.js admin@example.com
```

#### What Happens on Container Start

1. **Database initialization** - Creates SQLite database if it doesn't exist
2. **Automatic migrations** - Runs database migrations (creates users table, etc.)
3. **Application start** - Starts Next.js server

#### Managing Admins in Docker

```bash
# Create admin
docker exec fdc-app node scripts/make-admin.js user@example.com

# List all admins
docker exec fdc-app node scripts/list-admins.js

# Revoke admin rights
docker exec fdc-app node scripts/revoke-admin.js user@example.com
```

#### Database Backup

```bash
# Backup database
docker run --rm -v fdc-sqlite-data:/data -v "$PWD":/backup bash:5 \
  bash -lc 'cp /data/meals.db /backup/meals.db.$(date +%F).bak'

# Restore from backup
docker run --rm -v fdc-sqlite-data:/data -v "$PWD":/backup bash:5 \
  bash -lc 'cp /backup/meals.db.2024-12-30.bak /data/meals.db'
```

**Complete Docker documentation:**
- [DOCKER.md](./DOCKER.md) - Full Docker deployment guide with nginx/SSL setup
- [DOCKER_ADMIN_QUICK_REF.md](./DOCKER_ADMIN_QUICK_REF.md) - Quick reference for Docker admin commands

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
