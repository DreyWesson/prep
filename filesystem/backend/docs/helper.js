import { connectFS } from "../config/fs.config.js";
import { mergeObj } from "../utils/index.js";
export const init = () => ({
  paths: {},
  components: { securitySchemes: {} },
  tags: [],
  security: [],
});

export const extract = ({ paths, components, tags, security }) => {
  return {
    accPaths: paths,
    accComp: components,
    accTags: tags,
    accSec: security,
  };
};

export const extractComponents = (accComp, components) => {
  return {
    ...mergeObj(accComp, components),
    securitySchemes: mergeObj(
      accComp.securitySchemes,
      components?.securitySchemes
    ),
  };
};

export const swaggerFiles = [
  connectFS("../docs/info.yml"),
  connectFS("../docs/servers.yml"),
  connectFS("../docs/tags.yml"),
  connectFS("../docs/items.yml"),
  connectFS("../docs/users.yml"),
  connectFS("../docs/security.yml"),
];
