const fs = require("fs");

const { getObjectFromJSONFile, saveInArray, savePath } = require("./helpers");
const { cwd } = process;

const findPackagesJsonPaths = item => {
  const packagesPath = [];
  const savePackagesJsonPath = savePath(saveInArray(packagesPath));
  if (!item) return packagesPath;

  Object.keys(item).forEach(key => {
    if (key === "packages" && Array.isArray(item[key])) {
      item[key].forEach(savePackagesJsonPath);
    } else if (item[key] instanceof Object) {
      findPackagesJsonPaths(item[key]).forEach(savePackagesJsonPath);
    }
  });

  return packagesPath;
};

const getPathsFromConfig = configFile =>
  Object.entries(getObjectFromJSONFile(configFile).groups).reduce(
    (newObject, [key, value]) => ({
      ...newObject,
      [key]: findPackagesJsonPaths(value)
    }),
    {}
  );

const getPackagesList = packagePaths =>
  Object.entries(packagePaths).reduce((packagesList, [package, paths]) => {
    const packages = { ...packagesList };
    packages[package] = {};

    paths.forEach(path => {
      if (fs.existsSync(path)) {
        const { dependencies, devDependencies } = getObjectFromJSONFile(path);

        packages[package].dependencies = {
          ...packages[package].dependencies,
          ...dependencies
        };
        packages[package].devDependencies = {
          ...packages[package].devDependencies,
          ...devDependencies
        };
      } else {
        throw new Error(`'${path}' is missing.`);
      }
    });

    return packages;
  }, {});

const getDirectDependencies = configFile => {
  try {
    if (fs.existsSync(configFile)) {
      const packagesPaths = getPathsFromConfig(configFile);

      return getPackagesList(packagesPaths);
    } else {
      throw new Error(`There is no greenkeeper.json file in ${cwd()}`);
    }
  } catch (error) {}
};

module.exports = { getDirectDependencies };
