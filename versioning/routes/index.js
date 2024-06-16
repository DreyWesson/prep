import express from 'express';
import v1Routes from './v1/items.routes.js';
// Import other v1 routes if necessary
// import v2Routes from './v2/items.routes.js';

const v1 = express.Router();
const dev = express.Router();

// Use middleware specific to v1
v1.use((req, res, next) => {
  console.log('V1 Middleware');
  next();
});

// Use middleware specific to dev
dev.use((req, res, next) => {
  console.log('Dev Middleware');
  next();
});

// Mount routes to the v1 and dev routers
v1.use('/items', v1Routes);
dev.use('/items', v1Routes); // Assuming dev and api v1 share the same routes

export default { v1, dev };
