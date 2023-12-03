document.addEventListener("DOMContentLoaded", function () {
  const weatherUpdateBtn = document.getElementById("weatherUpdateButton");
  const weatherTable = document.getElementById("weatherTable");
  const currentDateElem = document.getElementById("currentDate");
  const currentTimeElem = document.getElementById("currentTime");
  const temperatureElem = document.getElementById("temperature");
  const conditionElem = document.getElementById("condition");

  weatherUpdateBtn.addEventListener("click", function () {
    // Simulate fetching weather data
    const mockData = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      temperature: "15°C",
      condition: "Sunny",
    };

    // Display the data
    currentDateElem.textContent = mockData.date;
    currentTimeElem.textContent = mockData.time;
    temperatureElem.textContent = mockData.temperature;
    conditionElem.textContent = mockData.condition;

    weatherTable.style.display = "block"; // Show the table that is initially hidden before the interaction
  });
});
