// import swaggerUi from 'swagger-ui-express';
// import YAML from 'yamljs';
// import { connectFS } from "../config/fs.config.js";


// const swaggerSpec = YAML.load(connectFS('../docs/items.swagger.yml'));

// export { swaggerSpec, swaggerUi };

// docs/index.js
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { connectFS } from "../config/fs.config.js";

const loadYamlFile = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8');
  return YAML.parse(file);
};

// const mergeYamlFiles = (filePaths) => {
//     return filePaths.reduce((acc, filePath) => {
//       const data = loadYamlFile(filePath);

//       if (!acc.paths) acc.paths = {};
//       if (!acc.components) acc.components = {};
//       if (!acc.tags) acc.tags = [];
  
//       return {
//         ...acc,
//         ...data,
//         paths: {
//           ...acc.paths,
//           ...data.paths,
//         },
//         components: {
//           ...acc.components,
//           ...data.components,
//         },
//         tags: [
//           ...acc.tags,
//           ...(data.tags || []),
//         ],
//       };
//     }, {});
//   };

// const swaggerFiles = [
//   connectFS('../docs/info.yml'),
//   connectFS('../docs/servers.yml'),
//   connectFS('../docs/tags.yml'),
//   connectFS('../docs/items.yml'),
//   connectFS('../docs/users.yml'),
// ];

// const swaggerSpec = mergeYamlFiles(swaggerFiles);

// export { swaggerSpec, swaggerUi };

const mergeYamlFiles = (filePaths) => {
  return filePaths.reduce((acc, filePath) => {
    const data = loadYamlFile(filePath);

    if (!acc.paths) acc.paths = {};
    if (!acc.components) acc.components = {};
    if (!acc.tags) acc.tags = [];
    if (!acc.security) acc.security = [];
    if (!acc.securitySchemes) acc.securitySchemes = {};

    return {
      ...acc,
      ...data,
      paths: {
        ...acc.paths,
        ...data.paths,
      },
      components: {
        ...acc.components,
        ...data.components,
        securitySchemes: {
          ...acc.components.securitySchemes,
          ...data.components?.securitySchemes,
        }
      },
      tags: [
        ...acc.tags,
        ...(data.tags || []),
      ],
      security: [
        ...acc.security,
        ...(data.security || []),
      ]
    };
  }, {});
};

const swaggerFiles = [
  connectFS('../docs/info.yml'),
  connectFS('../docs/servers.yml'),
  connectFS('../docs/tags.yml'),
  connectFS('../docs/items.yml'),
  connectFS('../docs/users.yml'),
  connectFS('../docs/security.yml'),
];

const swaggerSpec = mergeYamlFiles(swaggerFiles);

export { swaggerSpec, swaggerUi };
