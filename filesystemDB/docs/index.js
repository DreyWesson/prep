import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { connectDB } from "../config/fs.config.js";


const swaggerSpec = YAML.load(connectDB('../docs/items.swagger.yml'));

export { swaggerSpec, swaggerUi };

