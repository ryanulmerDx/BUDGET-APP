# Budget Tracker - 50/30/20 Rule

A modern budgeting application built with Next.js that helps you manage your finances using the popular 50/30/20 budgeting rule.

## About the 50/30/20 Rule

The 50/30/20 rule is a simple budgeting framework that divides your after-tax income into three categories:

- **50% Needs** - Essential expenses like rent, utilities, groceries, and insurance
- **30% Wants** - Discretionary spending like dining out, entertainment, and hobbies
- **20% Savings** - Emergency fund, investments, and debt payoff

## Features

- **Income Management**: Set and update your monthly income with an intuitive interface
- **Automatic Budget Calculation**: Automatically calculates your 50/30/20 budget split
- **Expense Tracking**: Add and categorize expenses across Needs, Wants, and Savings
- **Visual Progress Bars**: Color-coded progress indicators showing spending vs. budget
  - Green: Under 75% spent
  - Yellow: 75-90% spent
  - Red: Over 90% spent
- **Monthly Overview**: Dashboard view of all your budget categories and expenses
- **Data Persistence**: Local storage ensures your data persists across sessions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean interface built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Data Storage**: Browser Local Storage
- **Fonts**: Geist Sans and Geist Mono

## Project Structure

```
budget-app/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Dashboard.tsx     # Main container with state management
│   ├── IncomeSetup.tsx   # Income input component
│   ├── BudgetOverview.tsx # Budget breakdown display
│   ├── CategoryCard.tsx   # Individual category with progress
│   ├── ExpenseForm.tsx    # Add expense form
│   └── ExpenseList.tsx    # List of expenses
├── lib/                   # Utility functions
│   ├── storage.ts        # Local storage helpers
│   ├── calculations.ts   # Budget calculation logic
│   └── utils.ts          # General utilities
├── types/                 # TypeScript definitions
│   └── index.ts          # Type definitions
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd budget-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## How to Use

1. **Set Your Income**: Enter your monthly after-tax income in the Income Setup card
2. **View Your Budget**: See your automatic 50/30/20 split across the three categories
3. **Add Expenses**: Use the Add Expense form to track your spending
   - Select a category (Needs, Wants, or Savings)
   - Enter the amount and description
   - Choose the date of the expense
4. **Monitor Progress**: Watch the color-coded progress bars to stay within budget
5. **Review Expenses**: View all your expenses grouped by category with delete options

## Data Storage

All data is stored locally in your browser using `localStorage`. Your budget and expense data:

- Persists across browser sessions
- Is stored only on your device
- Is not sent to any server
- Can be cleared by clearing browser data

## Deployment

### Deploy to Vercel

The easiest way to deploy this app is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

### Other Deployment Options

This Next.js app can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Render
- AWS Amplify
- And more

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

The codebase is organized to make it easy to extend:

- Add new expense categories in `types/index.ts`
- Modify budget percentages in `lib/calculations.ts`
- Add new UI components in `components/`
- Customize styles in `app/globals.css`

## Browser Support

This app works on all modern browsers that support:
- ES6+ JavaScript
- Local Storage API
- CSS Grid and Flexbox

## License

MIT

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
