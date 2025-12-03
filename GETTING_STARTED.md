# Find My Embassy - React Application

## 🎉 Migration Complete!

Your .NET application has been successfully converted to a modern React application. The app is now running on **Vite**, a fast and modern build tool.

## 🚀 Quick Start

```bash
# Development mode (already running at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
FindMyEmbassy/
├── src/                          # React source code
│   ├── components/              # React components
│   │   ├── Navbar.jsx          # Search and navigation
│   │   ├── Navbar.css
│   │   ├── EmbassyInfo.jsx     # Embassy details and map
│   │   └── EmbassyInfo.css
│   ├── App.jsx                 # Main app component
│   ├── App.css
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/                      # Static assets
│   ├── Data/
│   │   └── embassies.json      # Embassy data (200+ countries)
│   └── images/                 # Icons and images
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js              # Vite config
├── README.md                    # Project documentation
└── MIGRATION.md                 # Migration details

Old .NET files (can be removed):
├── FindMyEmbassy/              # Old C# project
├── FindMyEmbassy.sln           # Visual Studio solution
└── .vs/                        # VS cache
```

## ✨ Features

- **🌍 Auto-location**: Detects your country automatically
- **🔍 Smart Search**: Find any country quickly
- **📞 Emergency Numbers**: Police, ambulance, fire department
- **🏛️ Embassy Info**: Contact details, hours, location
- **🗺️ Google Maps**: Interactive embassy location map

## 🛠️ Technology Stack

- **React 18** - Modern UI library
- **Vite 6** - Lightning-fast build tool
- **Google Maps API** - Maps and geocoding
- **Geolocation API** - Location detection

## 🎨 Component Architecture

### App.jsx

Main component that:

- Loads embassy data
- Manages application state
- Handles geolocation
- Coordinates child components

### Navbar.jsx

Navigation component with:

- Country search functionality
- Filtered search results
- Auto-complete dropdown

### EmbassyInfo.jsx

Display component showing:

- Emergency contact cards
- Embassy information
- Google Maps integration

## 📝 Optional Cleanup

You can safely delete these old .NET files:

```bash
# Remove old .NET project (OPTIONAL - keep if you want a backup)
Remove-Item -Recurse -Force FindMyEmbassy
Remove-Item FindMyEmbassy.sln
Remove-Item -Recurse -Force .vs
```

⚠️ **Note**: Only do this after you've confirmed the React app works correctly!

## 🔧 Configuration

### Google Maps API Key

Currently embedded in:

- `index.html` (Maps script)
- `App.jsx` (Geocoding)

For production, consider using environment variables:

```javascript
// .env
VITE_GOOGLE_MAPS_KEY = your_key_here;

// In code
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
```

## 🎯 Next Steps

### Immediate

1. ✅ Test the application thoroughly
2. ✅ Verify all countries load correctly
3. ✅ Test on mobile devices

### Future Enhancements

1. **TypeScript** - Add type safety
2. **Testing** - Jest + React Testing Library
3. **PWA** - Offline functionality
4. **Backend** - API for dynamic data
5. **i18n** - Multi-language support
6. **Dark Mode** - Theme switching
7. **Accessibility** - ARIA labels, keyboard navigation

## 🐛 Troubleshooting

### Maps not loading?

- Check internet connection
- Verify Google Maps API key is valid
- Check browser console for errors

### Location not detected?

- Browser needs HTTPS for geolocation
- User must grant permission
- Fallback to manual country selection

### Search not working?

- Check that `embassies.json` is in `/public/Data/`
- Verify JSON is valid
- Check browser console

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Google Maps API](https://developers.google.com/maps)

## 🤝 Contributing

The old .NET app had minimal backend logic, so this React-only version maintains all functionality. If you need server-side features in the future, consider:

- Node.js + Express
- Next.js (React with SSR)
- Remix (Full-stack React)

---

**Happy coding!** 🚀
