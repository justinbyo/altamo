# Altamo - Next.js Web App

A beginner-friendly Next.js application with local development server and live reload functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js installed on your machine
- npm package manager

### Starting the Development Server

1. **Open terminal in project directory:**
   ```bash
   cd /Users/justinbyo/development/altamo
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - The server typically runs on `http://localhost:3000`
   - If port 3000 is busy, it will use `http://localhost:3001` (or next available port)
   - The terminal will show you the exact URL to use

4. **Start coding!**
   - Any changes you make will automatically refresh the browser
   - No need to manually restart the server

### Stopping the Server
- Press `Ctrl + C` in the terminal to stop the development server

## 📁 Project Structure

```
altamo/
├── app/                    # Main application directory (App Router)
│   ├── checkout/           # Checkout page route
│   │   └── page.js        # Checkout page - order summary, payment, gratuity
│   ├── components/         # Reusable components
│   │   ├── Navigation.js  # Navigation bar with search and cart
│   │   ├── Payment.js     # Payment method selector
│   │   ├── ProductItem.js # Individual menu item card
│   │   └── ProductList.js # List of menu items by category
│   ├── data/              # Data files
│   │   └── products.js    # Menu items organized by category
│   ├── summary/           # Order summary page route
│   │   └── page.js        # Order confirmation page
│   ├── favicon.ico        # Website icon
│   ├── globals.css        # Global styles and Tailwind CSS
│   ├── layout.js          # Root layout component (wraps all pages)
│   └── page.js            # Home/Menu page - main ordering interface
├── public/                # Static assets (images, icons, etc.)
├── .eslintrc.json         # ESLint configuration for code quality
├── .gitignore             # Git ignore file
├── .next/                 # Build output (auto-generated, don't edit)
├── next.config.js         # Next.js configuration
├── node_modules/          # Dependencies (auto-generated, don't edit)
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Dependency lock file
├── postcss.config.js      # PostCSS configuration for Tailwind
├── README.md              # This file
└── tailwind.config.js     # Tailwind CSS configuration
```

## 📄 Pages

### Home (`/` - `app/page.js`)
The main menu page where users can:
- Browse menu items organized by category (Cocktails, Beer, Wine, Appetizers, Sandwiches, Pizza, Entrees, Dessert)
- Search for specific items using the search bar
- Add items to their order
- Navigate to checkout

### Checkout (`/checkout` - `app/checkout/page.js`)
Order review and payment page where users can:
- Review their order items and quantities
- Select payment method (Credit/Debit Card, Apple Pay, Google Pay, Cash)
- Choose gratuity percentage (15%, 18%, 20%, 25%, or custom)
- See order summary with subtotal, gratuity, and total
- Submit their order

### Summary (`/summary` - `app/summary/page.js`)
Order confirmation page that displays:
- Order confirmation with unique order number
- Complete order details
- Payment method and gratuity breakdown
- Options to edit order or change payment/gratuity

## 🧩 Components

### Navigation (`app/components/Navigation.js`)
Navigation bar that adapts based on current page:
- **On Home:** Shows search input and checkout button with cart count
- **On Checkout:** Shows "Back to Order" link

### ProductList (`app/components/ProductList.js`)
Displays menu items grouped by category with support for search filtering

### ProductItem (`app/components/ProductItem.js`)
Individual menu item card showing name, description, price, and "Add to Order" button

### Payment (`app/components/Payment.js`)
Payment method selector with support for:
- Credit/Debit Card (with input fields)
- Apple Pay
- Google Pay
- Cash

## 📊 Data Structure

### Product Data (`app/data/products.js`)
Menu items organized by category with:
- Category ID and name
- Item details (id, name, description, price)
- Helper functions for searching and filtering products

## 🛠️ Key Files to Edit

### `app/page.js` - Home/Menu Page
The main ordering page where users browse the menu and add items to their cart. Features search functionality and navigation to checkout.

### `app/checkout/page.js` - Checkout Page
Order review page with payment method selection and gratuity options.

### `app/summary/page.js` - Order Confirmation
Final confirmation page shown after order submission.

### `app/layout.js` - Site Layout
This wraps all your pages. Contains global metadata and body structure.

### `app/components/` - Reusable Components
Create and edit reusable UI components here:
- Navigation.js - Site navigation
- ProductList.js - Menu display
- ProductItem.js - Individual menu items
- Payment.js - Payment selection

### `app/data/products.js` - Menu Data
Contains all menu items organized by category. Update this file to modify the menu offerings.

### `app/globals.css` - Global Styles
Add your custom CSS here. Tailwind CSS is already configured.

## 📝 Development Features

- **Live Reload:** Changes appear instantly in the browser
- **Hot Module Replacement:** Updates without losing app state
- **ESLint:** Automatic code quality checking
- **Tailwind CSS:** Utility-first CSS framework
- **Turbopack:** Fast bundler for quick development builds

## 🎯 Next Steps for Development

1. **Create new pages:** Add new `.js` files in the `app/` directory
2. **Add components:** Create reusable components in `app/components/`
3. **Style with Tailwind:** Use Tailwind classes for quick styling
4. **Add images:** Place images in `public/` folder

## 📚 Helpful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🆘 Troubleshooting

### Server won't start?
- Make sure you're in the correct directory
- Run `npm install` to ensure dependencies are installed
- Check if another process is using the port

### Changes not showing?
- Make sure the dev server is running
- Check browser cache (try hard refresh: Cmd+Shift+R on Mac)
- Check terminal for any error messages

### Port already in use?
- Next.js will automatically find the next available port
- Check the terminal output for the correct URL to use

## 🔧 Built With

- **Next.js 15.5.4** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling framework
- **ESLint** - Code quality tool
- **Turbopack** - Fast bundler
