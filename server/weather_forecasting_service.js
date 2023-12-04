const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

var PROTO_PATH = __dirname + "/../protos/weather_forecasting_service.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const weatherProto = grpc.loadPackageDefinition(packageDefinition).weather;

// Removed mock data. The "real" weather data will be taken from here
const getWeatherUpdate = (call, callback) => {
  const temperature = Math.floor(Math.random() * 36) - 5; // Random temperature between -5 and 30
  let condition;

  if (temperature <= 0) {
    condition = Math.random() < 0.5 ? "Snowing" : "Sunny";
  } else {
    condition = Math.random() < 0.5 ? "Rainy" : "Sunny";
  }

  const response = {
    temperature,
    condition,
  };

  callback(null, response);
};

const server = new grpc.Server();
server.addService(weatherProto.WeatherForecastingService.service, {
  getWeatherUpdate,
});
server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Weather Forecasting Service running on port 40000");
  }
);
