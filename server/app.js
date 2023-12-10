// Express and other required modules
const express = require("express");
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Creating an Express application
const app = express();

// Defining the path to the weather proto file
const WEATHER_PROTO_PATH = "../protos/weather_service.proto";

// Loading the weather proto file
const weatherPackageDefinition = protoLoader.loadSync(WEATHER_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const weatherProto = grpc.loadPackageDefinition(
  weatherPackageDefinition
).weather;

// Creating a gRPC client for weather service
const weatherClient = new weatherProto.WeatherForecastingService(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

// Defining the path to the incident proto file
const INCIDENT_PROTO_PATH = "../protos/incident_service.proto";

// Loading the incident proto file
const incidentPackageDefinition = protoLoader.loadSync(INCIDENT_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const incidentProto = grpc.loadPackageDefinition(
  incidentPackageDefinition
).incident;

// Creating a gRPC client for incident service
const incidentClient = new incidentProto.IncidentAlertService(
  "localhost:40001",
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
      res.json(response);
    }
  });
});

// Route for air quality index
app.get("/api/air-quality", (req, res) => {
  weatherClient.GetAirQuality({}, (error, response) => {
    if (error) {
      res.status(500).send("Error fetching air quality data");
    } else {
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
      res.json(response);
    }
  });
});

// Route to handle Server-Sent Events (SSE) for incident alerts
app.get("/api/incidents", (req, res) => {
  console.log("SSE connection initiated.");

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const call = incidentClient.GetCurrentIncident({ location: "M50" });

  call.on("data", (incident) => {
    console.log("Sending SSE data:", incident);
    res.write(`data: ${JSON.stringify(incident)}\n\n`);
  });

  call.on("end", () => {
    console.log("SSE connection ended.");
    res.end();
  });

  call.on("error", (error) => {
    console.error("Error in incident stream:", error);
    res.status(500).end();
  });
});

// Starting the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
