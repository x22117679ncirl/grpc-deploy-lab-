const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Defining the path to the proto file in the server folder
var PROTO_PATH = __dirname + "/../protos/weather_forecasting_service.proto";

// Loading the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const weatherProto = grpc.loadPackageDefinition(packageDefinition).weather;

// Creating the gRPC server
const server = new grpc.Server();

// Implementing GetCurrentWeather service
server.addService(weatherProto.WeatherForecastingService.service, {
  GetCurrentWeather: (call, callback) => {
    // Simulating fetching weather data - TO BE UPDATED after testing
    const response = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      temperature: Math.floor(Math.random() * 35) - 5, // Random temperature
      weather: "Sunny", // TO BE UPDATED after testing
    };
    callback(null, response);
  },

  // Implementing GetAirQuality service
  GetAirQuality: (call, callback) => {
    // Simulate fetching air quality data
    const response = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      quality: Math.floor(Math.random() * 500), // Random air quality index
      message: "Good", // TO BE UPDATED after testing
    };
    callback(null, response);
  },

  // Implementing GetWindData service
  GetWindData: (call, callback) => {
    // Simulate fetching wind data
    const response = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      speed: Math.floor(Math.random() * 100), // Random wind speed
      direction: "North", // TO BE UPDATED after testing
    };
    callback(null, response);
  },
});

// Binding and starting the server
server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Weather Forecasting Service running on port 40000");
  }
);
