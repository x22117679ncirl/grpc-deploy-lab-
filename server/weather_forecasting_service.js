const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
var PROTO_PATH = "../protos/weather_forecasting_service.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const weatherProto = grpc.loadPackageDefinition(packageDefinition).weather;

const getWeatherUpdate = (call, callback) => {
  const response = {
    temperature: 15,
    rainForecast: "Light rain",
    snowForecast: "None",
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
