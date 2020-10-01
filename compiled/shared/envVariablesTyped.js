"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var projectRootFolder = path_1.default.join(__dirname, '../../');
var envFilePath = path_1.default.join(projectRootFolder, '.env');
// slurp the whole file as a long string
// split by new line
var fileContents = fs_1.default.readFileSync(envFilePath, { encoding: 'utf8' });
var fileContentsByLine = fileContents.split(/\n/);
// kick out bad lines
var kVPairStrings = fileContentsByLine.filter(function (line) {
    if (line === '' || /^#/.test(line)) {
        return false;
    }
    return true;
});
// key each kv pair to an object property
var envVariables = {};
kVPairStrings.forEach(function (kVPairString) {
    var arrayPair = kVPairString.split('=');
    var envKey = arrayPair[0], envValue = arrayPair[1];
    envVariables[envKey] = envValue;
});
// console.log('envVariables', envVariables);
// throw if no env variables
var numberOfEnvKeys = Object.keys(envVariables).length;
if (numberOfEnvKeys === 0) {
    throw new Error('.env file either missing or has no key/value pairs');
}
exports.default = envVariables;
