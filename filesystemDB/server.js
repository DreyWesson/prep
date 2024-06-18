import dotenv from "dotenv";
import injectApp from "./app.js";
import * as fsDatabase from "./controllers/fs/index.fs.controllers.js";
import mongoose from "mongoose";
import { connectNOSQL } from "./config/nosql.config.js";
import * as nosqlDatabase from "./controllers/nosql/index.nosql.controllers.js";


dotenv.config();

console.log('Connecting to MongoDB');
connectNOSQL();
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

const PORT = process.env.PORT || 80;
const app = injectApp(fsDatabase);

app.listen(PORT, () => console.log('Server is running on port ' + PORT));