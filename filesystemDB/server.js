import dotenv from "dotenv";
import injectApp from "./app.js";
import { database, testDatabase } from "./config/db.js";


dotenv.config();

const PORT = process.env.PORT || 80;
const app = injectApp(database);

app.listen(PORT, () => console.log('Server is running on port ' + PORT));