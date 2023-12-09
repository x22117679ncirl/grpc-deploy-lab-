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

  // New development start here
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
    fetch("/api/weather")
      .then((response) => response.json())
      .then((data) => {
        // Display the fetched data. The client is fetching it from the server.
        currentDateElem.textContent = data.date;
        currentTimeElem.textContent = data.time;
        temperatureElem.textContent = `${data.temperature}°C`;
        weatherElem.textContent = data.weather;
        weatherMessage.innerHTML = `<strong>M50 message:</strong> ${data.message}`;

        // Fetch and display air quality data.
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
    weatherTable.style.display = "block"; // Show the table that is initially hidden before the interaction
  });

  // Historical Weather
  historicalWeatherBtn.addEventListener("click", function () {
    fetch("/api/historical-weather")
      .then((response) => response.json())
      .then((data) => {
        let historicalDataHtml = "";
        data.records.forEach((record) => {
          historicalDataHtml += `
                    <tr>
                        <td>${record.date}</td>
                        <td>${record.maxTemperature}°C</td>
                        <td>${record.minTemperature}°C</td>
                        <td>${record.weather}</td>
                    </tr>
                `;
        });
        historicalWeatherDataElem.innerHTML = historicalDataHtml;
        historicalWeatherTable.style.display = "block";
      })
      .catch((error) => {
        console.error("Error fetching historical weather data:", error);
      });
  });
});
