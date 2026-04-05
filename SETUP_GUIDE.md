# Quick Setup Guide

## Prerequisites
- Node.js 14+ or higher
- npm or yarn package manager

## Installation (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```
or
```bash
yarn install
```

### Step 2: Start Development Server
```bash
npm run dev
```
or
```bash
yarn dev
```

### Step 3: Open in Browser
The app will automatically open at `http://localhost:3000`

## That's It! 🎉

The dashboard will open with pre-populated mock transaction data. You can:

1. **Switch Roles**: Use the dropdown in the header to toggle between Admin and Viewer modes
2. **Add Transactions**: Click "Add Transaction" button (Admin mode only)
3. **Filter Data**: Use search, type filter, category filter, and sorting options
4. **View Insights**: Scroll through the dashboard to see charts and financial insights
5. **Toggle Dark Mode**: Click the sun/moon icon in the header
6. **Export Data**: Click "Export CSV" to download your transaction data

## Build for Production
```bash
npm run build
```
or
```bash
yarn build
```

The production-ready files will be in the `dist/` folder.

## Troubleshooting

### Port 3000 Already in Use
Edit `vite.config.js` and change the port:
```javascript
server: {
  port: 3001, // or any other available port
}
```

### Dependencies Not Installing
Try clearing npm cache:
```bash
npm cache clean --force
npm install
```

### Module Not Found Errors
Make sure all dependencies are installed:
```bash
npm install react react-dom recharts lucide-react
```

## Project Structure
```
financetrack-dashboard/
├── src/
│   ├── finance-dashboard.jsx  # Main dashboard component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles with Tailwind
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS config
└── README.md                  # Full documentation
```

## Key Features to Test

1. **Role-Based UI**: Switch between Admin and Viewer to see different UI behaviors
2. **Add/Edit**: Try adding and editing transactions (Admin mode only)
3. **Filtering**: Search for transactions, filter by type and category
4. **Sorting**: Change sort order (date, amount, category)
5. **Dark Mode**: Toggle theme and see persistence across page reloads
6. **Export**: Download transaction data as CSV
7. **Responsive**: Resize browser to test mobile, tablet, and desktop layouts
8. **Empty States**: Clear all filters to see the empty state UI

## Need Help?

Refer to the full [README.md](./README.md) for comprehensive documentation, architecture details, and feature explanations.
