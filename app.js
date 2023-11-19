var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var PROTO_PATH = __dirname + "/protos/movies.proto";
var packageDefinition = protoLoader.loadSync(PROTO_PATH);

var movies_proto = grpc.loadPackageDefinition(packageDefinition).movies;

var data = [
  {
    movieType: "comedy",
    favouriteMovie: 40,
  },
  {
    movieType: "action",
    favouriteMovie: 50,
  },
  {
    movieType: "romance",
    favouriteMovie: 60,
  },
  {
    movieType: "drama",
    favouriteMovie: 10,
  },
  {
    movieType: "sciFi",
    favouriteMovie: 40,
  },
];

function getFavouriteMovies(call, callback) {
  for (var i = 0; i < data.length; i++) {
    call.write({
      movieType: data[i].movieType,
      favouriteMovie: data[i].favouriteMovie,
    });
  }
  call.end();
}

var server = new grpc.Server();
server.addService(movies_proto.MovieService.service, {
  getFavouriteMovies: getFavouriteMovies,
});
server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  function () {
    server.start();
  }
);
