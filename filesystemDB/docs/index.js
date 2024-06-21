
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

export { swaggerSpec};
