document.addEventListener("DOMContentLoaded", function () {
  const weatherUpdateBtn = document.getElementById("weatherUpdateButton");

  weatherUpdateBtn.addEventListener("click", function () {
    fetchWeatherData();
    fetchAirQualityData();
    fetchWindData();
  });

  function fetchWeatherData() {
    fetch("/api/weather")
      .then((response) => response.json())
      .then((data) => displayWeatherData(data))
      .catch((error) => console.error("Error fetching weather data:", error));
  }

  function fetchAirQualityData() {
    fetch("/api/air-quality")
      .then((response) => response.json())
      .then((data) => displayAirQualityData(data))
      .catch((error) =>
        console.error("Error fetching air quality data:", error)
      );
  }

  function fetchWindData() {
    fetch("/api/wind-data")
      .then((response) => response.json())
      .then((data) => displayWindData(data))
      .catch((error) => console.error("Error fetching wind data:", error));
  }

  function displayWeatherData(data) {
    const { date, time, temperature, weather } = data;
    let row = `<tr>
        <td>${date}</td>
        <td>${time}</td>
        <td>${temperature}°C</td>
        <td>${weather}</td>
    </tr>`;
    document.getElementById("weatherData").innerHTML = row;
    document.getElementById("weatherTable").style.display = "block";
  }

  function displayAirQualityData(data) {
    const { date, time, quality, message } = data;
    const airQualityDataElem = document.getElementById("airQualityData");
    let row = `<tr>
          <td>${date}</td>
          <td>${time}</td>
          <td>${quality}</td>
          <td>${message}</td>
      </tr>`;
    airQualityDataElem.innerHTML = row;
    document.getElementById("airQualityTable").style.display = "block";
  }

  function displayWindData(data) {
    const { date, time, speed, direction } = data;
    const windDataElem = document.getElementById("windData");
    let row = `<tr>
          <td>${date}</td>
          <td>${time}</td>
          <td>${speed} km/h</td>
          <td>${direction}</td>
      </tr>`;
    windDataElem.innerHTML = row;
    document.getElementById("windDataTable").style.display = "block";
  }
});
