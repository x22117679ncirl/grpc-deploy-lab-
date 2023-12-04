// Express documentation: https://expressjs.com/en/guide/using-template-engines.html
const express = require("express");
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const app = express();

const PROTO_PATH = "../protos/weather_forecasting_service.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const weatherProto = grpc.loadPackageDefinition(packageDefinition).weather;
const weatherClient = new weatherProto.WeatherForecastingService(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

app.use(express.static(path.join(__dirname, "../client")));

app.get("/api/weather", (req, res) => {
  weatherClient.GetCurrentWeather({}, (error, response) => {
    if (error) {
      res.status(500).send("Error fetching weather data");
    } else {
      const enhancedResponse = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        temperature: response.temperature,
        weather: response.weather,
        message: response.message,
      };
      res.json(enhancedResponse);
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
