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

//1. Function: getCurrentWeather function
//Removed mock data. The "real" weather data will be taken from here
const getCurrentWeather = (call, callback) => {
  // Random temperature between -5 and 30 degrees (assumptions of temperatures in Ireland)
  const temperature = Math.floor(Math.random() * 36) - 5;

  let weather;
  let message;

  // Logic to dynamically create the info
  if (temperature <= 0) {
    weather = Math.random() < 0.5 ? "Snowing" : "Sunny";
    message =
      weather === "Snowing"
        ? "Snow chains and Winter tyers are MANDATORY"
        : "Enjoy the sunny day";
  } else {
    weather = Math.random() < 0.5 ? "Rainy" : "Sunny";
    message =
      weather === "Rainy"
        ? "SLOW DOWN and keep a safe distance."
        : "Enjoy the sunny day";
  }

  const response = {
    temperature,
    weather,
    message,
  };

  callback(null, response);
};

//2.Function: get getAirQuality function
const getAirQuality = (call, callback) => {
  // Randomize air quality value between 0 and 500
  const quality = Math.floor(Math.random() * 501);

  let message;
  if (quality <= 50) {
    message = "Good";
  } else if (quality <= 100) {
    message = "Moderate";
  } else if (quality <= 150) {
    message = "Unhealthy for Sensitive Groups";
  } else if (quality <= 200) {
    message = "Unhealthy";
  } else if (quality <= 300) {
    message = "Very Unhealthy";
  } else {
    message = "Hazardous";
  }

  const response = {
    quality,
    message,
  };

  callback(null, response);
};

const server = new grpc.Server();
server.addService(weatherProto.WeatherForecastingService.service, {
  getCurrentWeather,
  getAirQuality,
});

server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Weather Forecasting Service running on port 40000");
  }
);
