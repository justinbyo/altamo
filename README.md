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
│   ├── favicon.ico        # Website icon
│   ├── globals.css        # Global styles and Tailwind CSS
│   ├── layout.js          # Root layout component (wraps all pages)
│   └── page.js            # Home page component
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

## 🛠️ Key Files to Edit

### `app/page.js` - Home Page
This is your main landing page. Edit this file to change what visitors see first.

### `app/layout.js` - Site Layout
This wraps all your pages. Good place for:
- Navigation bars
- Footers
- Global components
- HTML head content

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
