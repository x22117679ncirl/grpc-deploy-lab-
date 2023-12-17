// Wait until DOM Content is loaded before proceeding with the whole script
document.addEventListener("DOMContentLoaded", function () {
  // Get the "Get Weather Update", "Get Live Incidents", "Toll System," and "Profit" buttons based on their IDs
  const weatherUpdateBtn = document.getElementById("weatherUpdateButton");
  const incidentAlertsBtn = document.getElementById("incidentAlertsButton");
  const tollSystemButton = document.getElementById("tollSystemButton");
  const profitButton = document.getElementById("profitButton");

  // Define a variable to store the daily profit
  let dailyProfit = 0;

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

  // Event listener for form submission
  const tollForm = document.getElementById("tollForm");
  tollForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the selected vehicle type and distance traveled from the form
    const vehicleType = document.getElementById("vehicleType").value;
    const distanceTraveled = parseFloat(
      document.getElementById("distanceTraveled").value
    );

    // Create a JSON object representing the TollRequest
    const tollRequest = {
      vehicle_type: vehicleType,
      distance_traveled: distanceTraveled,
    };

    // Log the TollRequest to the console
    console.log("TollRequest:", tollRequest); // DEBUG

    // Make an HTTP POST request to the server to calculate toll
    fetch("/api/track-vehicle-performance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tollRequest),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text(); // Change to response.text()
      })
      .then(function (data) {
        // Log the TollResponse to the console
        console.log("TollResponse:", data); // DEBUG

        try {
          const responseData = JSON.parse(data); // Parse the response as JSON
          // Check if responseData is a valid JSON object
          if (
            typeof responseData === "object" &&
            responseData.hasOwnProperty("toll_amount")
          ) {
            // Add the toll amount to the daily profit
            dailyProfit += responseData.toll_amount;

            // Display the calculated toll_amount in the result section
            const tollAmountElement = document.getElementById("tollAmount");
            tollAmountElement.textContent = responseData.toll_amount;
            document.getElementById("tollResult").style.display = "block";
          } else {
            console.error("Invalid JSON response from the server");
          }
        } catch (error) {
          console.error("Error parsing JSON response:", error);
        }
      })
      .catch(function (error) {
        console.error("Error calculating toll:", error);
      });
  });

  profitButton.addEventListener("click", function () {
    // Log the daily profit when the Profit button is clicked
    console.log("Daily Profit:", dailyProfit);
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

  // Function definition to subscribe to incident alerts
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
