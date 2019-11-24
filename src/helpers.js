const fs = require("fs");
const path = require("path");

const { cwd } = process;

const readFile = encoding => file => fs.readFileSync(file, encoding);
const readUTF8File = readFile("utf8");
const readJSONFile = readFile => jsonFile => JSON.parse(readFile(jsonFile));
const getObjectFromJSONFile = readJSONFile(readUTF8File);
const saveInArray = array => element => array.push(element);
const savePath = savePath => file => savePath(path.resolve(cwd(), file));

module.exports = {
  getObjectFromJSONFile,
  saveInArray,
  savePath
};
