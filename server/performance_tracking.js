// Import the necessary packages
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Load the gRPC service definitions
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

// Initialize the dailyProfit variable
let dailyProfit = 0;

// Create a gRPC server
const server = new grpc.Server();

// Define the function to track vehicle performance
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

// Define the function to calculate daily profit
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

// Add the services to the gRPC server
server.addService(performanceTrackingProto.TollCalculationService.service, {
  TrackVehiclePerformance: trackVehiclePerformance,
});
server.addService(
  performanceTrackingProto.DailyProfitCalculationService.service,
  { CalculateDailyProfit: calculateDailyProfit }
);

// Start the gRPC server
server.bindAsync(
  "0.0.0.0:40002",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Performance Tracking Service running on port 40002");
  }
);
