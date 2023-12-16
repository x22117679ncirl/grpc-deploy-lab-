const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

var PROTO_PATH = __dirname + "/../protos/congestion_report_service.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const congestionProto =
  grpc.loadPackageDefinition(packageDefinition).congestion;

const sendTrafficData = (call, callback) => {
  call.on("data", (trafficData) => {
    console.log("Received traffic data:", trafficData);
  });

  call.on("end", () => {
    callback(null, {
      congestionLevel: "Moderate",
      congestionWarning: "Expect some delays",
    });
  });
};

const server = new grpc.Server();
server.addService(congestionProto.CongestionReportService.service, {
  sendTrafficData,
});
server.bindAsync(
  "0.0.0.0:40002",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Congestion Report Service running on port 40002");
  }
);
