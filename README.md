## Recipe Book

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=fff)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?logo=webpack&logoColor=fff)
![IndexedDB](https://img.shields.io/badge/IndexedDB-blue?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xOCA3YzAtLjU1LS40NS0xLTEtMXMtMSAuNDUtMSAxdjEwaDEuOTNjLjM5LTEuMDguNTctMi4yLjU3LTMuMzYgMC0yLjEtLjc5LTMuOC0yLjE3LTQuOThDMTYuODcgNy41OSAxNy4zOSA3LjI2IDE4IDdoMHoiLz48L3N2Zz4=)

[![CI](https://github.com/attila-huszar/recipe-book/actions/workflows/ci.yml/badge.svg)](https://github.com/attila-huszar/recipe-book/actions/workflows/ci.yml)
[![Build](https://github.com/attila-huszar/recipe-book/actions/workflows/build.yml/badge.svg)](https://github.com/attila-huszar/recipe-book/actions/workflows/build.yml)
[![CodeQL](https://github.com/attila-huszar/recipe-book/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/attila-huszar/recipe-book/actions/workflows/github-code-scanning/codeql)
[![GitHub last commit](https://img.shields.io/github/last-commit/attila-huszar/recipe-book/main?logo=github)](https://github.com/attila-huszar/recipe-book/commits/main)

A modern recipe book application with offline-first storage using IndexedDB for persistent browser-based data.

<img src="https://s3.eu-central-1.amazonaws.com/attila.huszar/recipe-book/index.webp" alt="recipe book" width="500">

## Features

### 🎯 Core Features

- **Recipe Management**: Add, edit, delete, and view recipes
- **Ingredient Tracking**: Manage ingredients with quantities and units
- **Favorites System**: Mark recipes as favorites for quick access
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 💾 Storage Features

- **IndexedDB Storage**: Offline-first browser storage
  - Works completely offline after initial load
  - Data persists across browser sessions
  - No server required for basic functionality
  - Automatic seeding from initial recipe collection

### ⚙️ Data Management

- **Data Export/Import**: Backup and restore your recipe collection
- **Reset to Default**: Restore original recipe collection
- **Clear Data**: Start fresh when needed
- **Offline Operation**: Full functionality without internet connection

## Getting Started

### Prerequisites

- Node.js (>= 20.10.0)
- Modern browser with IndexedDB support

### Installation

1. Clone the repository:

```bash
git clone https://github.com/attila-huszar/recipe-book.git
cd recipe-book
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will open in your browser at `http://localhost:3001`.

### First Launch

On your first visit, the application will automatically:

- Initialize IndexedDB storage
- Seed the database with sample recipes and ingredients from JSON files
- Set up offline functionality

## Usage

### Managing Recipes

1. **Add Recipe**: Click the "+" button to create a new recipe
2. **Edit Recipe**: Click the edit icon on any recipe card
3. **Delete Recipe**: Click the delete icon and confirm
4. **Mark as Favorite**: Click the heart icon to add/remove from favorites

### Settings Panel

Click the settings icon (⚙️) in the top-right corner to:

- Export your recipe data as JSON backup
- Import recipe data from a backup file
- Reset to default recipe collection
- Clear all stored data

### Data Export/Import

- **Export**: Creates a timestamped JSON backup file with all recipes and ingredients
- **Import**: Restore recipes from a previously exported JSON file
- **Reset**: Clear current data and restore original recipe collection

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

### Project Structure

```
src/
├── api/
│   ├── dataService.js     # Main data service (IndexedDB only)
│   └── indexeddb.js       # IndexedDB operations
├── components/
│   ├── cards.js           # Recipe card components
│   ├── modal.js           # Add/edit recipe modal
│   ├── drawer.js          # Recipe details drawer
│   └── settings.js        # Settings modal
├── assets/
│   └── db_local/
│       └── db.json        # Initial recipe data for seeding
└── utils/                 # Utility functions
```

### Data Storage

The application uses IndexedDB with two object stores:

- **recipes**: Stores recipe data with auto-incrementing IDs
- **ingredients**: Stores ingredient data with auto-incrementing IDs

Data is automatically seeded from `src/assets/db_local/db.json` on first launch.

### Browser Support

- Chrome/Edge 23+
- Firefox 29+
- Safari 10+
- Any modern browser with IndexedDB support

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
