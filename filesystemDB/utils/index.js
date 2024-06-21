import fs from "fs";
import YAML from "yaml";



export const loadYamlFile = (filePath) => {
  const file = fs.readFileSync(filePath, "utf8");
  return YAML.parse(file);
};

export const mergeArr = (arr1, arr2 = []) => [...arr1, ...(arr2 || [])];
export const mergeObj = (obj1, obj2) => ({ ...obj1, ...obj2 });
