# React Weather App

A sleek, glassmorphic weather app built with React. Search any city to get live weather conditions with a clean blue/cyan themed UI.

## Features

- Search weather by city name
- Real-time temperature, "feels like", humidity, and wind speed
- Dynamic icons and gradients based on current weather condition (Clear, Rain, Snow, Thunderstorm, Fog, etc.)
- Glassmorphic UI with animated glow accents
- Built with the OpenWeatherMap API (Geocoding + Current Weather endpoints)

## Tech Stack

- React (functional components + hooks)
- OpenWeatherMap API
- Custom inline SVG icon set (no external icon library)
- Plain CSS (styled via a scoped `<style>` block)

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Wareesha-faheem/Weather-App-React
cd Weather-App-React
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

Create a `.env` file in the project root:

**Vite projects:**
```
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

**Create React App projects:**
```
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
```

Get a free API key from [OpenWeatherMap](https://openweathermap.org/api).

### 4. Run the app

```bash
npm run dev
```

## Project Structure

```
├── src/
│   └── Weather.jsx     # Main weather component
├── .env                # API key (not committed)
├── .env.example         # Template for required env vars
└── README.md
```

## Notes

- Weather data is fetched in metric units (°C, m/s).
- If a searched city isn't found, the app shows a friendly error message instead of crashing.

## Author

Made with ❤️ by **Wareesha Faheem**
NUCES'29 | DevWeekends'26
