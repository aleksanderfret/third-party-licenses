const fs = require("fs");
const os = require("os");
const path = require("path");

const { cwd } = process;

/**
 * --greenkeeper -g   // use greenkeeper config
 * --lerna -l         // use lerna config
 * --json -j          // use json format
 * --markdown -m      // use markdown format
 * --csv -c           // use csv format
 * --csvPrefix -v     // set csv column separator
 * --output -o        // set output file path
 * --production -p    // show only production dependencies
 * --development -d   // show only production dependencies
 * --root -r          // show only root direct dependencies
 * --exclude -e       // packages to exclude
 * --array -a         // array of package json
 * --start -s         // path for initial package json file
 */

// helpers
const readFile = encoding => file => fs.readFileSync(file, encoding);
const readUTF8File = readFile("utf8");
const readJSONFile = readFile => jsonFile => JSON.parse(readFile(jsonFile));
const getObjectFromJSONFile = readJSONFile(readUTF8File);
const saveInArray = array => element => array.push(element);
const savePath = savePath => file => savePath(path.resolve(cwd(), file));

const arguments = process.argv.slice(2);

console.log(arguments);

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

if (fs.existsSync("greenkeeper.json")) {
  const greenkeeperJSON = getObjectFromJSONFile("greenkeeper.json");

  const paths = Object.entries(greenkeeperJSON.groups).reduce(
    (newObject, [key, value]) => ({
      ...newObject,
      [key]: findPackagesJsonPaths(value)
    }),
    {}
  );

  const directDependencies = Object.entries(paths).reduce(
    (newObject, [key, value]) => {
      const modules = { ...newObject };
      modules[key] = {};

      value.forEach(value => {
        if (fs.existsSync(value)) {
          const { dependencies, devDependencies } = getObjectFromJSONFile(
            value
          );

          modules[key].dependencies = {
            ...modules[key].dependencies,
            ...dependencies
          };
          modules[key].devDependencies = {
            ...modules[key].devDependencies,
            ...devDependencies
          };
        } else {
          throw new Error(`'${value}' is missing.`);
        }
      });

      return modules;
    },
    {}
  );

  console.log(directDependencies);
}
