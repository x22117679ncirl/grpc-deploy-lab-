// Express documentation: https://expressjs.com/en/guide/using-template-engines.html
// Express and other required modules
const express = require("express");
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Creating an Express application
const app = express();

// Defining the path to the proto file
const PROTO_PATH = "../protos/weather_forecasting_service.proto";

// Loading the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const weatherProto = grpc.loadPackageDefinition(packageDefinition).weather;

// Creating a gRPC client
const weatherClient = new weatherProto.WeatherForecastingService(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

// Serving static files from the 'client' directory
app.use(express.static(path.join(__dirname, "../client")));

// Route for weather updates
app.get("/api/weather", (req, res) => {
  weatherClient.GetCurrentWeather({}, (error, response) => {
    if (error) {
      res.status(500).send("Error fetching weather data");
    } else {
      console.log("Weather Data Response:", response); // For debugging
      res.json(response);
    }
  });
});

// Route for air quality index
app.get("/api/air-quality", (req, res) => {
  console.log("Air Quality API called"); // For debugging
  weatherClient.GetAirQuality({}, (error, response) => {
    if (error) {
      console.error("Error fetching air quality data:", error);
      res.status(500).send("Error fetching air quality data");
    } else {
      console.log("Air Quality Response:", response); // For debugging
      res.json(response);
    }
  });
});

// Route for wind data
app.get("/api/wind-data", (req, res) => {
  weatherClient.GetWindData({}, (error, response) => {
    if (error) {
      res.status(500).send("Error fetching wind data");
    } else {
      console.log("Wind Data Response:", response); // For debugging
      res.json(response);
    }
  });
});

// Starting the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
