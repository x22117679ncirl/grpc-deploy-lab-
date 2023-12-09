document.addEventListener("DOMContentLoaded", function () {
  const weatherUpdateBtn = document.getElementById("weatherUpdateButton");
  const weatherTable = document.getElementById("weatherTable");
  const weatherMessage = document.getElementById("weatherMessage");
  const currentDateElem = document.getElementById("currentDate");
  const currentTimeElem = document.getElementById("currentTime");
  const temperatureElem = document.getElementById("temperature");
  const weatherElem = document.getElementById("weather");
  const airQualityIndexElem = document.getElementById("airQualityIndex");
  const airQualityMessageElem = document.getElementById("airQualityMessage");
  const historicalWeatherBtn = document.getElementById(
    "historicalWeatherButton"
  );
  const historicalWeatherTable = document.getElementById(
    "historicalWeatherTable"
  );
  const historicalWeatherDataElem = document.getElementById(
    "historicalWeatherData"
  );

  weatherUpdateBtn.addEventListener("click", function () {
    updateWeather(
      currentDateElem,
      currentTimeElem,
      temperatureElem,
      weatherElem,
      weatherMessage,
      airQualityIndexElem,
      airQualityMessageElem,
      weatherTable
    );
  });

  historicalWeatherBtn.addEventListener("click", function () {
    updateHistoricalWeather(historicalWeatherDataElem, historicalWeatherTable);
  });
});

function updateWeather(
  currentDateElem,
  currentTimeElem,
  temperatureElem,
  weatherElem,
  weatherMessage,
  airQualityIndexElem,
  airQualityMessageElem,
  weatherTable
) {
  fetch("/api/weather")
    .then((response) => response.json())
    .then((data) => {
      currentDateElem.textContent = data.date;
      currentTimeElem.textContent = data.time;
      temperatureElem.textContent = `${data.temperature}°C`;
      weatherElem.textContent = data.weather;
      weatherMessage.innerHTML = `<strong>M50 message:</strong> ${data.message}`;

      return fetch("/api/air-quality");
    })
    .then((response) => response.json())
    .then((airQualityData) => {
      airQualityIndexElem.textContent = airQualityData.quality;
      airQualityMessageElem.textContent = airQualityData.message;
    })
    .catch((error) => {
      console.error("Error fetching air quality data:", error);
    });
  weatherTable.style.display = "block";
}

function updateHistoricalWeather(
  historicalWeatherDataElem,
  historicalWeatherTable
) {
  fetch("/api/historical-weather")
    .then((response) => response.json())
    .then((data) => {
      let historicalDataHtml = "";
      data.records.forEach((record) => {
        historicalDataHtml += `
                  <tr>
                      <td>${record.date}</td>
                      <td>${record.time}</td>
                      <td>${record.temperature}°C</td>
                      <td>${record.weather}</td>
                      <td>${record.airQualityIndex}</td>
                      <td>${record.airQualityMessage}</td>
                  </tr>`;
      });
      historicalWeatherDataElem.innerHTML = historicalDataHtml;
      historicalWeatherTable.style.display = "block";
    })
    .catch((error) => {
      console.error("Error fetching historical weather data:", error);
    });
}
