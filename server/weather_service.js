// Required gRPC module and proto loader
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Defining the path to the proto file in the server folder
const PROTO_PATH = __dirname + "/../protos/weather_service.proto";

// Loading the proto file with configuration
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
    // Simulating fetching weather data
    const response = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      temperature: Math.floor(Math.random() * 35) - 5, // Random temperature
      weather: "☀️ Sunny", // Static weather passsed
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
      message: "🟢 Good", // Static message passsed
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
      direction: "💨 North",
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
