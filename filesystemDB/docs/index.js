import swaggerUi from "swagger-ui-express";
import { extract, extractComponents, init, swaggerFiles } from "./helper.js";
import { loadYamlFile, mergeArr, mergeObj } from "../utils/index.js";

const mergeYamlFiles = (filePaths) => {
  return filePaths.reduce((acc, filePath) => {
    const data = loadYamlFile(filePath);
    const { paths, components, tags, security } = data;
    const { accPaths, accComp, accTags, accSec } = extract(acc);

    return {
      ...acc,
      ...data,
      paths: mergeObj(accPaths, paths),
      components: extractComponents(accComp, components),
      tags: [...mergeArr(accTags, tags)],
      security: [...mergeArr(accSec, security)],
    };
  }, init());
};

const swaggerSpec = mergeYamlFiles(swaggerFiles);

export { swaggerSpec, swaggerUi };

// import swaggerUi from 'swagger-ui-express';
// import fs from 'fs';
// import path from 'path';
// import YAML from 'yaml';
// import { connectFS } from "../config/fs.config.js";

// const loadYamlFile = (filePath) => {
//   const file = fs.readFileSync(filePath, 'utf8');
//   return YAML.parse(file);
// };

// const mergeYamlFiles = (filePaths) => {
//   return filePaths.reduce((acc, filePath) => {
//     const data = loadYamlFile(filePath);

//     if (!acc.paths) acc.paths = {};
//     if (!acc.components) acc.components = {};
//     if (!acc.tags) acc.tags = [];
//     if (!acc.security) acc.security = [];
//     if (!acc.securitySchemes) acc.securitySchemes = {};

//     return {
//       ...acc,
//       ...data,
//       paths: {
//         ...acc.paths,
//         ...data.paths,
//       },
//       components: {
//         ...acc.components,
//         ...data.components,
//         securitySchemes: {
//           ...acc.components.securitySchemes,
//           ...data.components?.securitySchemes,
//         }
//       },
//       tags: [
//         ...acc.tags,
//         ...(data.tags || []),
//       ],
//       security: [
//         ...acc.security,
//         ...(data.security || []),
//       ]
//     };
//   }, {});
// };

// const swaggerFiles = [
//   connectFS('../docs/info.yml'),
//   connectFS('../docs/servers.yml'),
//   connectFS('../docs/tags.yml'),
//   connectFS('../docs/items.yml'),
//   connectFS('../docs/users.yml'),
//   connectFS('../docs/security.yml'),
// ];

// const swaggerSpec = mergeYamlFiles(swaggerFiles);

// export { swaggerSpec, swaggerUi };
