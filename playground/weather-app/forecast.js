// src/components/Forecast.js
import React from 'react';

const Forecast = ({ data }) => {
  if (!data || !data.list) {
    return null;
  }

  return (
    <div className="forecast">
      <h2>5-Day Forecast</h2>
      <div className="forecast-list">
        {data.list.map((forecast, index) => (
          <div key={index} className="forecast-item">
            <p>{new Date(forecast.dt_txt).toLocaleDateString()}</p>
            <p>Temp: {forecast.main.temp}°C</p>
            <p>{forecast.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
