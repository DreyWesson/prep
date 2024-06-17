import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { connectFS } from "../config/fs.config.js";


const swaggerSpec = YAML.load(connectFS('../docs/items.swagger.yml'));

export { swaggerSpec, swaggerUi };

