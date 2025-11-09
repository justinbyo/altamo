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
│   │   ├── DevPanel.js    # Development debugging panel with order inspection
│   │   ├── Navigation.js  # Navigation bar with search and cart
│   │   ├── OrderManagerTest.js # Automated test suite for OrderManager
│   │   ├── Payment.js     # Payment method selector
│   │   ├── ProductItem.js # Individual menu item card with quantity controls
│   │   └── ProductList.js # List of menu items by category
│   ├── data/              # Data files
│   │   └── products.js    # Menu items organized by category
│   ├── lib/               # Utility libraries and business logic
│   │   └── orderManager.js # Core order state management and persistence
│   ├── order/             # Order/Menu page route
│   │   └── page.js        # Main menu page with item selection
│   ├── schemas/           # Data structure definitions
│   │   └── order.js       # Order state definitions and constants
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

## 🔄 Edit State System

The app supports two main states that change the UI and behavior:

### **Default State** (Normal Flow)
- **URL:** `/order` → `/checkout` → `/summary`
- **User Flow:** Browse menu → Add items → Select payment → Submit order → See confirmation
- **Navigation:** "Checkout" button goes to `/checkout`

### **Edit State** (Order Modification)
- **URL:** `/order?edit` and `/checkout?edit`
- **User Flow:** From summary page → Edit existing order → Update items/payment → Update order
- **Navigation:** "Add Items" button goes to `/checkout?edit`

### **How Edit State Works**

1. **URL Query Parameters:**
   - `?edit` query parameter activates edit state on any page
   - Example: `/order?edit`, `/checkout?edit`

2. **State Detection:**
   ```javascript
   const searchParams = useSearchParams();
   const isEditMode = searchParams.get('edit') !== null;
   ```

3. **Prop Passing to Components:**
   ```javascript
   // Pages pass edit state to Navigation component
   <Navigation 
     currentPage="order" 
     cartItemCount={cart.length}
     isEditMode={isEditMode}  // Critical prop for conditional behavior
   />
   ```

4. **Conditional UI with Ternary Operators:**
   ```javascript
   // Page titles change based on state
   {isEditMode ? 'Edit Order - Add Items' : 'Menu'}
   
   // Navigation buttons adapt
   {isEditMode ? 'Add Items' : 'Checkout'}
   
   // URLs change to preserve state
   href={isEditMode ? "/checkout?edit" : "/checkout"}
   ```

5. **Edit State Features:**
   - **`/order?edit`:** Shows "Edit Order - Add Items" title, "Add Items" button
   - **`/checkout?edit`:** Shows "Edit Order" title, locks payment methods, "Update Order" button
   - **Back navigation preserves state:** `/checkout?edit` → "Back" → `/order?edit`

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

## � Order State Management System

### **OrderManager Class (`app/lib/orderManager.js`)**
Central utility class managing all order operations with persistent storage:

#### **Order Lifecycle States:**
```javascript
'building'   → User adding items to new order
'submitted'  → Order completed, payment processed  
'editing'    → User modifying submitted order
```

#### **Core Methods:**
- **`generateOrderId()`** - Creates unique order identifiers (ORD-XXXXX)
- **`createOrder(orderId)`** - Initializes new order with default state
- **`getOrder(orderId)`** - Retrieves order from localStorage with error handling
- **`addItems(orderId, items, isEditMode)`** - Adds items with state-aware logic
- **`submitOrder(orderId, paymentMethod, gratuity)`** - Processes order submission
- **`getAllItems(order)`** - Returns all items (original + edit items)
- **`getCartItems(order)`** - Returns current session items for UI display
- **`getCurrentSessionItems(order)`** - Returns items being added in current session
- **`calculateTotal(order)`** - Computes subtotal, gratuity, and total with logging

#### **Data Structure:**
```javascript
// Complete order object structure
{
  id: 'ORD-ABC123',           // Unique identifier
  state: 'building',          // Current lifecycle state
  items: [...],               // Items being built (building state)
  originalItems: [...],       // Items from initial submission  
  editItems: [...],          // Items added during edit sessions
  payment: {
    method: 'card',           // Payment method selected
    isLocked: true,           // Prevents changes after submission
    lastFour: '1234'          // Card display info
  },
  gratuity: 18,              // Tip percentage (not amount)
  createdAt: '2025-11-09...',
  submittedAt: '2025-11-09...',
  lastUpdated: '2025-11-09...'
}
```

#### **Persistent Storage Features:**
- **localStorage Integration:** All orders automatically saved with error handling
- **URL State Synchronization:** Order IDs tracked via `?order=ORD-XXXXX` parameters
- **Cross-Session Persistence:** Orders survive browser refreshes and navigation
- **Size Monitoring:** Storage quota detection and logging for debugging

#### **Development & Debugging Tools:**
- **DevPanel Component:** Real-time order inspection and management interface
- **Automated Test Suite:** OrderManagerTest component for regression testing  
- **Debug Methods:** `debugOrder()` for detailed console inspection
- **Comprehensive Logging:** Tip changes, item additions, state transitions

### **State-Aware UI Components:**
- **Cart Count Logic:** Shows session items vs. total items based on context
- **NEW Badge System:** Visual indicators for items added during edit sessions  
- **Payment Locking:** Prevents payment method changes after submission
- **Conditional Navigation:** Back buttons and URLs preserve order and edit state

## �📊 Data Structure

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

---

## 📋 Development Changelog

### **November 9, 2025 - OrderManager Refinements & Debugging**

#### **🎯 Learning Goal:** Fix edit mode limitations, enhance debugging, and improve tip management

#### **Changes Made:**

1. **Edit Mode Item Limit Fix:**
   - **Problem:** Users could only add 1 item in edit mode due to state handling bug
   - **Solution:** Fixed `addItems()` to handle both `'submitted'` and `'editing'` states
   - **Code pattern learned:**
     ```javascript
     // Handle state transitions properly in edit mode
     if (isEditMode && (order.state === 'submitted' || order.state === 'editing')) {
       order.editItems = [...(order.editItems || []), ...itemsToAdd];
       order.state = 'editing';
     }
     ```

2. **Cart Count Logic Improvement:**
   - Created `getCurrentSessionItems()` method for better UX in edit mode
   - Cart badge now shows items being added in current session, not total items
   - **Benefits:** Less confusing UI, clearer indication of new items being added

3. **NEW Badge Implementation:**
   - Added visual indicators for items added during edit sessions
   - Consistent badge display across checkout and summary pages
   - **Code pattern learned:**
     ```javascript
     {item.isNew && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">NEW</span>}
     ```

4. **Comprehensive Tip Management Logging:**
   - **New method:** `OrderManager.updateGratuity()` with change logging
   - Enhanced `submitOrder()` to log tip changes during submission
   - Enhanced `calculateTotal()` to log calculation breakdowns
   - **Checkout page:** Added real-time tip change detection and logging
   - **Code pattern learned:**
     ```javascript
     // Tip change detection with logging
     const handleGratuityChange = (newGratuity) => {
       if (newGratuity !== gratuity) {
         console.log(`💰 User changed gratuity from ${gratuity}% to ${newGratuity}%`);
         setGratuity(newGratuity);
       }
     };
     ```

5. **Enhanced Development Tools:**
   - **Updated DevPanel:** More detailed order state inspection
   - **Automated Test Suite:** `OrderManagerTest` component for regression testing
   - **Debug Methods:** `debugOrder()` for detailed console inspection
   - **Error Handling:** Improved localStorage error detection and reporting

#### **🎓 Key Concepts Learned:**
1. **State Machine Debugging** - Tracking state transitions and handling edge cases
2. **Session vs. Total State** - Different UI contexts need different data representations
3. **Real-time User Feedback** - Console logging for development and debugging
4. **Automated Testing** - Building test suites for complex state management
5. **Error Boundary Patterns** - Graceful handling of localStorage and serialization errors

#### **🔄 Current Order State Architecture:**
```javascript
// Order object structure
{
  id: 'ORD-XXXXX',
  state: 'building' | 'submitted' | 'editing',
  items: [],        // Items being built (building state)
  originalItems: [], // Items from initial submission
  editItems: [],    // Items added during edit sessions
  payment: { method, isLocked, lastFour },
  gratuity: 15,     // Tip percentage
  createdAt: '2025-11-09T...',
  submittedAt: '2025-11-09T...' | null
}
```

---

### **November 9, 2025 - OrderManager Implementation**

#### **🎯 Learning Goal:** Implement persistent order state management with proper architecture

#### **Changes Made:**

1. **OrderManager Utility Class:**
   - Created comprehensive order management system
   - **File created:** `app/lib/orderManager.js`
   - **Features:** Order creation, item management, payment handling, state persistence
   - **Code pattern learned:**
     ```javascript
     // Static class methods for utility operations
     export class OrderManager {
       static generateOrderId() { ... }
       static getOrder(orderId) { ... }
       static addItems(orderId, items, isEditMode) { ... }
     }
     ```

2. **Persistent Storage Integration:**
   - localStorage used for order persistence across browser sessions
   - Order data survives page refreshes and navigation
   - **Code pattern learned:**
     ```javascript
     // Safe localStorage usage with error handling
     try {
       localStorage.setItem(`order-${orderId}`, JSON.stringify(orderData));
     } catch (error) { console.error('Error saving:', error); }
     ```

3. **URL-Based Order Tracking:**
   - Orders tracked via `?order=ORD-XXXXX` URL parameters
   - Automatic order ID generation and URL updating
   - **Code pattern learned:**
     ```javascript
     // URL state management with router
     const params = new URLSearchParams(searchParams);
     params.set('order', orderId);
     router.replace(`/order?${params.toString()}`, { scroll: false });
     ```

4. **Order State Architecture:**
   - **States:** `building` → `submitted` → `editing`
   - **Item tracking:** Separate arrays for original vs. edit items
   - **Payment locking:** Prevents changes after initial submission
   - **Code pattern learned:**
     ```javascript
     // State-based item management
     if (isEditMode && order.state === 'submitted') {
       order.editItems = [...order.editItems, ...itemsToAdd];
       order.state = 'editing';
     }
     ```

5. **Component Integration Updates:**
   - **Order Page:** Integrated OrderManager for item addition and state
   - **Checkout Page:** Real order data instead of mock data
   - **Summary Page:** Live order display with edit functionality
   - **ProductItem:** Added quantity controls with +/- buttons
   - **Navigation:** Order ID passed through all navigation links

6. **Development Tools:**
   - **File created:** `app/components/DevPanel.js`
   - Real-time order debugging and management
   - Clear all orders functionality for testing

#### **🎓 Key Concepts Learned:**
1. **Static Class Methods** - Utility classes with static methods for shared operations
2. **localStorage API** - Client-side persistent storage with error handling
3. **URL State Management** - Using router to manage application state via URLs
4. **State Machines** - Order lifecycle management with defined state transitions
5. **React useEffect** - Managing side effects for order loading and URL updates
6. **Quantity Controls** - Interactive UI components with state management

#### **🔄 Enhanced User Flow:**
- **Order Creation:** Automatic ID generation and URL tracking
- **Item Management:** Quantity selection with persistent cart state
- **Edit Mode:** Proper separation of original vs. edit items
- **Payment Locking:** Secure payment state after submission
- **Cross-Page State:** Order data persists across all pages

---

### **November 8, 2025 - Edit State System Implementation**

#### **🎯 Learning Goal:** Implement URL-based state management and conditional UI rendering

#### **Changes Made:**

1. **URL Structure Update:**
   - Changed main page from `/` to `/order` for clearer routing
   - Added `/` redirect to `/order` for backward compatibility
   - **Files modified:** `app/page.js` (redirect), `app/order/page.js` (new main page)

2. **Edit State System:**
   - Implemented `?edit` query parameter for state management
   - Added `useSearchParams()` hook to detect edit mode
   - **Files modified:** `app/order/page.js`, `app/checkout/page.js`
   - **Code pattern learned:**
     ```javascript
     const searchParams = useSearchParams();
     const isEditMode = searchParams.get('edit') !== null;
     ```

3. **Prop Passing Architecture:**
   - Updated Navigation component to receive `isEditMode` prop
   - Learned about React's "data flows down" principle
   - **Files modified:** `app/components/Navigation.js`
   - **Code pattern learned:**
     ```javascript
     // Component definition with props
     export default function Navigation({ currentPage, isEditMode = false }) {
     
     // Passing props from parent
     <Navigation currentPage="order" isEditMode={isEditMode} />
     ```

4. **Ternary Operators for Conditional UI:**
   - Implemented conditional rendering based on edit state
   - Learned ternary operator syntax and usage in JSX
   - **Code patterns learned:**
     ```javascript
     // Conditional text content
     {isEditMode ? 'Edit Order - Add Items' : 'Menu'}
     
     // Conditional URLs with state preservation
     href={isEditMode ? "/order?edit" : "/order"}
     
     // Conditional button text
     {isEditMode ? 'Add Items' : 'Checkout'}
     ```

5. **Summary Page Button Updates:**
   - Updated navigation buttons to use edit state URLs
   - **File modified:** `app/summary/page.js`
   - **Links updated:** "Edit Order" → `/order?edit`, "Change Payment" → `/checkout?edit`

#### **🐛 Debugging Session:**
- **Problem:** Navigation showing wrong `isEditMode` value on checkout page
- **Solution:** Added console.log debugging to trace prop passing
- **Learning:** How to systematically debug React prop flow issues

#### **🎓 Key Concepts Learned:**
1. **URL Query Parameters** - Using `useSearchParams()` to read URL state
2. **React Props** - Passing data from parent to child components
3. **Ternary Operators** - `condition ? valueIfTrue : valueIfFalse` for conditional rendering
4. **State Preservation** - Maintaining state across page navigation via URLs
5. **Debugging Techniques** - Using console.log to trace data flow in React

#### **🔄 User Flow Now Working:**
- **Normal:** `/order` → `/checkout` → `/summary`
- **Edit:** `/summary` → "Edit Order" → `/order?edit` → "Add Items" → `/checkout?edit`
- **Navigation:** Back buttons preserve edit state throughout the flow
