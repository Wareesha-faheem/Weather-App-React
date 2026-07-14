import React, { useState, useCallback } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const Icon = {
  Search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Loader: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}>
      <path d="M12 2 A10 10 0 0 1 22 12" />
    </svg>
  ),
  Pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Droplet: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 2s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12Z" />
    </svg>
  ),
  Wind: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h15a3 3 0 1 1-3 3" /><path d="M3 16h9a3 3 0 1 1-3 3" />
    </svg>
  ),
  Alert: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  ),
  Sun: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  ),
  Cloud: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17.5 19H8a5.5 5.5 0 1 1 1.3-10.9A6 6 0 0 1 21 10.5a4.5 4.5 0 0 1-3.5 8.5Z" />
    </svg>
  ),
  Rain: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17.5 13H8a5.5 5.5 0 1 1 1.3-10.9A6 6 0 0 1 21 4.5a4.5 4.5 0 0 1-3.5 8.5Z" />
      <path d="M8 18v2M12 18v2M16 18v2" />
    </svg>
  ),
  Storm: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17.5 13.5H8a5.5 5.5 0 1 1 1.3-10.9A6 6 0 0 1 21 5a4.5 4.5 0 0 1-3.5 8.5Z" />
      <path d="M13 15l-3 5h3l-2 4" />
    </svg>
  ),
  Snow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17.5 13H8a5.5 5.5 0 1 1 1.3-10a6 6 0 0 1 10.9 3.5A4.5 4.5 0 0 1 17.5 13Z" />
      <path d="M8 18v3M8 18l-2 1M8 18l2 1M14 19v3M14 19l-2 1M14 19l2 1" />
    </svg>
  ),
  Fog: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17.5 9H8a5.5 5.5 0 1 1 1.3-10a6 6 0 0 1 10.9 3.5A4.5 4.5 0 0 1 17.5 9Z" />
      <path d="M3 16h18M3 20h18" />
    </svg>
  ),
};

// --- Weather condition -> icon + accent (kept entirely within a blue/cyan family) --
const CONDITION_MAP = {
  Clear: { icon: Icon.Sun, label: "Clear sky", from: "#38BDF8", to: "#2563EB" },
  Clouds: { icon: Icon.Cloud, label: "Cloudy", from: "#60A5FA", to: "#3B5BDB" },
  Rain: { icon: Icon.Rain, label: "Rainy", from: "#22D3EE", to: "#2563EB" },
  Drizzle: { icon: Icon.Rain, label: "Drizzling", from: "#22D3EE", to: "#2563EB" },
  Thunderstorm: { icon: Icon.Storm, label: "Thunderstorm", from: "#4F46E5", to: "#1E3A8A" },
  Snow: { icon: Icon.Snow, label: "Snowy", from: "#BAE6FD", to: "#38BDF8" },
  Mist: { icon: Icon.Fog, label: "Misty", from: "#93C5FD", to: "#5B7DB1" },
  Haze: { icon: Icon.Fog, label: "Hazy", from: "#93C5FD", to: "#5B7DB1" },
  Fog: { icon: Icon.Fog, label: "Foggy", from: "#93C5FD", to: "#5B7DB1" },
};

function getCondition(main) {
  return CONDITION_MAP[main] || { icon: Icon.Cloud, label: main || "Unknown", from: "#38BDF8", to: "#2563EB" };
}

export default function Weather() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = useCallback(async () => {
    const city = query.trim();
    if (!city) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
      );
      if (!geoRes.ok) throw new Error("Couldn't reach the location service.");
      const geoData = await geoRes.json();

      if (!geoData.length) {
        setStatus("error");
        setErrorMsg(`No city found matching "${city}".`);
        return;
      }

      const { lat, lon, name, country } = geoData[0];

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (!weatherRes.ok) throw new Error("Couldn't fetch weather data.");
      const data = await weatherRes.json();

      setWeather({
        name,
        country,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: data.weather?.[0]?.main,
      });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const cond = weather ? getCondition(weather.condition) : { icon: Icon.Sun, label: "", from: "#38BDF8", to: "#2563EB" };
  const ConditionIcon = cond.icon;

  return (
    <div className="wx-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

        .wx-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
          background: radial-gradient(circle at 20% 15%, #16305C 0%, #0B1731 45%, #060B18 100%);
          font-family: 'Inter', sans-serif;
        }

        .wx-glow {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          opacity: 0.35;
        }

        .wx-card {
          position: relative;
          width: 100%;
          max-width: 320px;
          border-radius: 22px;
          padding: 24px 22px 18px;
          background: rgba(255,255,255,0.045);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(96,165,250,0.25);
          box-shadow: 0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.03) inset;
        }

        .wx-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          text-align: center;
          color: #60A5FA;
          margin-bottom: 4px;
        }
        .wx-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 22px;
          text-align: center;
          letter-spacing: -0.01em;
          color: #F0F6FF;
          margin-bottom: 16px;
        }

        .wx-search-row { display: flex; gap: 8px; margin-bottom: 14px; }
        .wx-input {
          flex: 1;
          border-radius: 12px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(96,165,250,0.25);
          color: #F0F6FF;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .wx-input::placeholder { color: rgba(226,235,250,0.4); }
        .wx-input:focus { border-color: #38BDF8; background: rgba(255,255,255,0.09); }

        .wx-btn {
          width: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #38BDF8, #2563EB);
          color: #fff;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
        }
        .wx-btn:hover { transform: translateY(-1px); }
        .wx-btn:active { transform: scale(0.94); }
        .wx-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .wx-spin { animation: wx-spin 0.8s linear infinite; }
        @keyframes wx-spin { to { transform: rotate(360deg); } }

        .wx-error {
          display: flex; align-items: center; gap: 6px;
          border-radius: 10px; padding: 9px 11px; margin-bottom: 12px;
          background: rgba(248, 81, 81, 0.12);
          border: 1px solid rgba(248, 81, 81, 0.3);
          color: #FCA5A5; font-size: 12px;
        }

        .wx-empty {
          text-align: center; padding: 26px 10px;
          color: rgba(226,235,250,0.45); font-size: 12.5px;
        }

        .wx-city-row {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          margin-bottom: 12px; color: rgba(226,235,250,0.7); font-size: 12.5px;
        }

        .wx-badge {
          width: 68px; height: 68px; border-radius: 9999px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 10px;
          box-shadow: 0 0 26px 2px var(--glow, rgba(56,189,248,0.35));
        }

        .wx-temp {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 42px;
          text-align: center;
          color: #F8FAFF;
          line-height: 1;
          margin-bottom: 3px;
        }
        .wx-cond {
          text-align: center; font-size: 12px; color: rgba(226,235,250,0.55); margin-bottom: 16px;
        }

        .wx-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .wx-stat {
          border-radius: 13px; padding: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(96,165,250,0.15);
          display: flex; flex-direction: column; align-items: center; gap: 3px;
        }
        .wx-stat-value {
          font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13.5px; color: #F0F6FF;
        }
        .wx-stat-label { font-size: 9.5px; color: rgba(226,235,250,0.4); text-transform: uppercase; letter-spacing: 0.07em; }

        .wx-footer {
          text-align: center; margin-top: 16px; font-size: 10.5px;
          color: rgba(226,235,250,0.4); font-family: 'Inter', sans-serif;
        }
        .wx-footer b { color: #60A5FA; font-weight: 600; }
      `}</style>

      <div className="wx-glow" style={{ width: 260, height: 260, top: "-6%", left: "-8%", background: "#2563EB" }} />
      <div className="wx-glow" style={{ width: 220, height: 220, bottom: "-8%", right: "-8%", background: "#22D3EE" }} />

      <div className="wx-card">
        <p className="wx-eyebrow">Live Forecast</p>
        <h1 className="wx-title">Weather</h1>

        <div className="wx-search-row">
          <input
            type="text"
            className="wx-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search a city..."
          />
          <button className="wx-btn" onClick={handleSearch} disabled={status === "loading"} aria-label="Search">
            {status === "loading" ? <Icon.Loader className="wx-spin" width={16} height={16} /> : <Icon.Search width={16} height={16} />}
          </button>
        </div>

        {status === "error" && (
          <div className="wx-error">
            <Icon.Alert width={15} height={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {!weather && status !== "error" && (
          <p className="wx-empty">Search a city to see current conditions</p>
        )}

        {weather && (
          <div>
            <div className="wx-city-row">
              <Icon.Pin width={13} height={13} />
              <span>{weather.name}, {weather.country}</span>
            </div>

            <div
              className="wx-badge"
              style={{
                background: `linear-gradient(135deg, ${cond.from}, ${cond.to})`,
                "--glow": `${cond.to}55`,
              }}
            >
              <ConditionIcon width={34} height={34} color="#fff" />
            </div>

            <div className="wx-temp">{weather.temp}°</div>
            <p className="wx-cond">{cond.label} · Feels like {weather.feelsLike}°</p>

            <div className="wx-stats">
              <div className="wx-stat">
                <Icon.Droplet width={15} height={15} color="#38BDF8" />
                <span className="wx-stat-value">{weather.humidity}%</span>
                <span className="wx-stat-label">Humidity</span>
              </div>
              <div className="wx-stat">
                <Icon.Wind width={15} height={15} color="#38BDF8" />
                <span className="wx-stat-value">{weather.windSpeed} m/s</span>
                <span className="wx-stat-label">Wind</span>
              </div>
            </div>
          </div>
        )}

        <p className="wx-footer">Made with <b>&lt;3</b> by <b>Wareesha Faheem</b></p>
      </div>
    </div>
  );
}