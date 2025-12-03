# Find My Embassy

A React application that helps users find emergency contact numbers and embassy information based on their location.

## Features

- 🌍 Automatic location detection
- 🔍 Search for countries
- 📞 Emergency contact numbers (Police, Ambulance, Fire Department)
- 🏛️ Embassy contact information and location
- 🗺️ Interactive Google Maps integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Google Maps API** - Map display and geocoding
- **Geolocation API** - User location detection

## Data

Embassy and emergency contact information is stored in `/public/Data/embassies.json`

## License

This project contains data sourced from public embassy information.
