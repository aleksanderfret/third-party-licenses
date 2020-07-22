const fs = require("fs");
const os = require("os");
const path = require("path");
const parseArgs = require("minimist");

const greenkeeper = require("./src/greenkeeper");

const { cwd } = process;

/**
 * --greenkeeper -u   // use greenkeeper config
 * --lerna -l         // use lerna config
 * --json -j          // use json format
 * --markdown -m      // use markdown format
 * --csv -c           // use csv format
 * --csvPrefix -x     // set csv column separator
 * --output -o        // set output file path
 * --production -p    // show only production dependencies
 * --development -d   // show only production dependencies
 * --root -r          // show only root direct dependencies
 * --exclude -e       // packages to exclude
 * --files -f         // package.json file list
 * --start -s         // path for initial package json file
 * --into - i         // split into modules
 * --group -u         // keep prod and dev dependencies in separate groups
 * --values -v        // list of values to include in result
 */

const args = parseArgs(process.argv.slice(2));

if (args.l && args.g) {
  throw new Error();
} else if (args.g) {
  const { getDirectDependencies } = greenkeeper;
  const directDependencies = getDirectDependencies("greenkeeper.json");

  console.log(directDependencies);
} else if (args.l) {
  console.log("use lerna json to get dependencies");
} else {
  console.log("get dependencies from main package.json");
}
