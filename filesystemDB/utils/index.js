import { randomUUID } from "crypto";
import fs from "fs";
import YAML from "yaml";
import bcrypt from "bcrypt";

export const loadYamlFile = (filePath) => {
  const file = fs.readFileSync(filePath, "utf8");
  return YAML.parse(file);
};

export const mergeArr = (arr1, arr2 = []) => [...arr1, ...(arr2 || [])];

export const mergeObj = (obj1, obj2) => ({ ...obj1, ...obj2 });

export const initializeUser = async (body) => ({
  ...body,
  roles: {
    user: 2001,
  },
  id: randomUUID(),
  password: await bcrypt.hash(body.password, 10),
  createdAt: new Date().toISOString(),
});