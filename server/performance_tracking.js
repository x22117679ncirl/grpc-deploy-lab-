const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/../protos/performance_tracking.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const performanceTrackingProto =
  grpc.loadPackageDefinition(packageDefinition).performance_tracking;

let dailyProfit = 0;

const trackVehiclePerformance = (call) => {
  call.on("data", (tollRequest) => {
    let tollAmount = calculateToll(
      tollRequest.vehicle_type,
      tollRequest.distance_traveled
    );
    call.write({ toll_amount: tollAmount });
  });

  call.on("end", () => {
    call.end();
  });
};

const calculateDailyProfit = (call) => {
  call.on("data", (vehiclePaymentResponse) => {
    dailyProfit += vehiclePaymentResponse.toll_amount;
  });

  call.on("end", () => {
    call.write({ total_profit: dailyProfit });
    call.end();
  });
};

function calculateToll(vehicleType, distanceTraveled) {
  let rate = 0.1;
  if (vehicleType === "motorbike") rate = 0.15;
  if (vehicleType === "bus") rate = 0.2;
  if (vehicleType === "truck") rate = 0.25;

  return distanceTraveled * rate;
}

const server = new grpc.Server();
server.addService(performanceTrackingProto.TollCalculationService.service, {
  TrackVehiclePerformance: trackVehiclePerformance,
});
server.addService(
  performanceTrackingProto.DailyProfitCalculationService.service,
  { CalculateDailyProfit: calculateDailyProfit }
);

server.bindAsync(
  "0.0.0.0:40002",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Performance Tracking Service running on port 40002");
  }
);
