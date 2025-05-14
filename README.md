# NextLevel Food

A platform for food enthusiasts to share recipes, discover new dishes, and connect with other food lovers.

## 📋 Project Overview

NextLevel Food is a web application that allows users to:
- Share their favorite recipes with the world
- Discover new dishes from other food enthusiasts
- Connect with like-minded people in the food community
- Participate in exclusive food-related events

## 🚀 Technologies Used

- **Frontend**: 
  - [Next.js 15](https://nextjs.org/) - React framework with App Router
  - [React 19](https://react.dev/) - UI library
  - [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
  - CSS Modules - For component-scoped styling

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
│   ├── NavLink/          # Navigation link component
│   └── __tests__/        # Component tests
├── public/               # Public static files
└── __mocks__/            # Test mocks
```

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GyGaByyyTe/next.level.food.git
   cd next.level.food
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🖥️ Usage

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

Build the application for production:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## 🧪 Testing

The project includes comprehensive tests for components and pages.

Run all tests:
```bash
npm test
```

Run tests in watch mode (useful during development):
```bash
npm run test:watch
```

For more information about testing, see the [testing documentation](./components/__tests__/README.md).

## 📦 Deployment

The application can be deployed on [Vercel](https://vercel.com/), the platform from the creators of Next.js:

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure the build settings

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
