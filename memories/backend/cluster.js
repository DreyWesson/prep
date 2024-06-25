import cluster from "cluster";
import os from "os";
import server from "./server.js";

console.log(os.cpus().length);

if (cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = os.cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on("exit", function () {
    cluster.fork();
  });
} else {
  server;
}
