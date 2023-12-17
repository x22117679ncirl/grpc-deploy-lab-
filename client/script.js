// Wait until DOM Content is loaded before proceeding with the whole script
document.addEventListener("DOMContentLoaded", function () {
  // Get the "Get Weather Update", "Get Live Incidents", "Toll System" and "Today's Revenue" buttons based on their IDs
  const weatherUpdateBtn = document.getElementById("weatherUpdateButton");
  const incidentAlertsBtn = document.getElementById("incidentAlertsButton");
  const tollSystemButton = document.getElementById("tollSystemButton");
  const todaysRevenueButton = document.getElementById("todaysRevenueButton");

  // Add event listener based on click on the "Get Weather Update Button"
  weatherUpdateBtn.addEventListener("click", function () {
    // Call functions to fetch weather, air quality, and wind data when the button is clicked
    fetchWeatherData();
    fetchAirQualityData();
    fetchWindData();
  });

  // Add event listener based on click on the "Get Live Incidents"
  incidentAlertsBtn.addEventListener("click", function () {
    subscribeToIncidentAlerts();
  });

  // Function definition to fetch weather data
  function fetchWeatherData() {
    console.log("Fetching weather data...");
    // Fetch from the weather API
    fetch("/api/weather")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Call the displayWeatherData to display the data
        console.log("Weather data received:", data);
        displayWeatherData(data);
      })
      .catch(function (error) {
        // Log any errors that could occur during the fetching operation
        console.error("Error fetching weather data:", error);
      });
  }

  // Add event listener based on click on the "Toll System" button
  tollSystemButton.addEventListener("click", function () {
    // Show the tollSystemForm
    const tollSystemForm = document.getElementById("tollSystemForm");
    tollSystemForm.style.display = "block";
  });

  todaysRevenueButton.addEventListener("click", function () {
    // LOGIC TO BE ADDED as soon everything works
  });

  // Function definition to fetch air quality data
  function fetchAirQualityData() {
    console.log("Fetching air quality data...");
    // Fetch from the air quality API
    fetch("/api/air-quality")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("Air quality data received:", data);
        displayAirQualityData(data);
      })
      .catch(function (error) {
        console.error("Error fetching air quality data:", error);
      });
  }

  function fetchWindData() {
    console.log("Fetching wind data...");
    fetch("/api/wind-data")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("Wind data received:", data);
        displayWindData(data);
      })
      .catch(function (error) {
        console.error("Error fetching wind data:", error);
      });
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

  function subscribeToIncidentAlerts() {
    console.log("Subscribing to Incident Alerts...");

    const incidentAlertsResult = document.getElementById(
      "incidentAlertsResult"
    );
    incidentAlertsResult.style.display = "block";
    const incidentDataElem = document.getElementById("incidentData");
    incidentDataElem.innerHTML = "";

    const eventSource = new EventSource("/api/incidents");

    eventSource.onopen = function (event) {
      console.log("EventSource opened:", event);
    };

    eventSource.onmessage = function (event) {
      console.log("Received SSE message:", event.data);
      try {
        const incident = JSON.parse(event.data);
        const row = `
          <tr>
            <td>${incident.date}</td>
            <td>${incident.time}</td>
            <td>${incident.motorwaySection}</td>
            <td>${incident.description}</td>
          </tr>`;
        incidentDataElem.innerHTML += row;
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    eventSource.onerror = function (error) {
      error.preventDefault();
      console.log("No Incident Detected (error prevented)", error);
      eventSource.close();
    };

    eventSource.onclose = function () {
      console.log("EventSource connection closed.");
      console.log("No Incident Detected");
    };
  }
});
