import dotenv from "dotenv";
import injectApp from "./app.js";
import * as fsDatabase from "./controllers/fs/index.fs.controllers.js";
import mongoose from "mongoose";
import { connectNOSQL } from "./config/nosql.config.js";
import * as nosqlDatabase from "./controllers/nosql/index.nosql.controllers.js";


dotenv.config();

connectNOSQL();
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
const database = (false) ? nosqlDatabase : fsDatabase;
const PORT = process.env.PORT || 80;
const app = injectApp(database);

app.listen(PORT, () => console.log('Server is running on port ' + PORT));