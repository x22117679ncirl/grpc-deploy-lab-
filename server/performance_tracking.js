// Required gRPC module and proto loader
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Defining the path to the proto file in the server folder
const PROTO_PATH = __dirname + "/../protos/performance_tracking.proto";

// Loading the proto file with configuration
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const performanceTrackingProto =
  grpc.loadPackageDefinition(packageDefinition).performance_tracking;

// Initializing the dailyProfit variable to track all calculated tool amounts
let dailyProfit = 0;

// Creating the gRPC server
const server = new grpc.Server();

// Defining the TrackVehiclePerformance stream handler
const trackVehiclePerformance = (call) => {
  call.on("data", (tollRequest) => {
    let tollAmount = calculateToll(
      tollRequest.vehicle_type,
      tollRequest.distance_traveled
    );

    // Send the TollResponse back to the client
    call.write({ toll_amount: tollAmount });

    // Update the dailyProfit
    dailyProfit += tollAmount;
  });

  call.on("end", () => {
    call.end();
  });
};

// Defining service for sending daily profit
const calculateDailyProfit = (call) => {
  // Send the total daily profit back to the client
  call.write({ total_profit: dailyProfit });
  call.end();
};

// Function to calculate toll based on vehicle type and distance
function calculateToll(vehicleType, distanceTraveled) {
  let rate = 0.1;
  if (vehicleType === "motorbike") rate = 0.15;
  if (vehicleType === "bus") rate = 0.2;
  if (vehicleType === "truck") rate = 0.25;

  return distanceTraveled * rate;
}

// Add the TollCalculationService services to the server
server.addService(performanceTrackingProto.TollCalculationService.service, {
  TrackVehiclePerformance: trackVehiclePerformance,
});
server.addService(
  performanceTrackingProto.DailyProfitCalculationService.service,
  { CalculateDailyProfit: calculateDailyProfit }
);

// Binding and starting the server
server.bindAsync(
  "0.0.0.0:40002",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Performance Tracking Service running on port 40002");
  }
);
