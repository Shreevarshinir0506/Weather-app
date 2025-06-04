const apiKey = "faa60186667337f942cb6f5f4301201e";

async function getWeather() {
  const city = document.getElementById("city-input").value;
  if (!city) return;

  const weatherInfo = document.getElementById("weather-info");
  const forecastDiv = document.getElementById("forecast");

  try {
    // Fetch current weather
    const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const currentData = await currentRes.json();

    weatherInfo.innerHTML = `
      <h2>${currentData.name}, ${currentData.sys.country}</h2>
      <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" />
      <p><strong>${currentData.main.temp}°C</strong> - ${currentData.weather[0].description}</p>
      <p>Humidity: ${currentData.main.humidity}% | Wind: ${currentData.wind.speed} m/s</p>
    `;

    // Fetch 5-day forecast
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastRes.json();

    // Filter 1 forecast per day (every 24h from 3-hour steps)
    const dailyData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    forecastDiv.innerHTML = dailyData.map(day => {
      const date = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      return `
        <div class="forecast-day">
          <p><strong>${date}</strong></p>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
          <p>${day.main.temp}°C</p>
          <p>${day.weather[0].main}</p>
        </div>
      `;
    }).join('');
  } catch (error) {
    weatherInfo.innerHTML = `<p style="color: red;">${error.message}</p>`;
    forecastDiv.innerHTML = "";
  }
}
