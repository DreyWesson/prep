const server = require("./src/config.js");

async function startServer() {
  await server.start();

  const express = require("express");
  const app = express();
  const PORT = process.env.PORT || 4000;



  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => console.error(err));
