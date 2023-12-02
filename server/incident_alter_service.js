const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

var PROTO_PATH = __dirname + "/../protos/incident_alert_service.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const incidentProto = grpc.loadPackageDefinition(packageDefinition).incident;

const subscribeToIncidentAlerts = (call) => {
  let incidents = [
    { incidentLocation: "M50 Junction 7", advice: "Reduce speed" },
    { incidentLocation: "M50 Junction 9", advice: "Lane closure" },
  ];

  incidents.forEach((incident) => {
    call.write(incident);
  });

  call.end();
};

const server = new grpc.Server();
server.addService(incidentProto.IncidentAlertService.service, {
  subscribeToIncidentAlerts,
});
server.bindAsync(
  "0.0.0.0:40001",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Incident Alert Service running on port 40001");
  }
);
