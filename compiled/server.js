"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var moment_1 = __importDefault(require("moment"));
var router_1 = __importDefault(require("./customProperties/router"));
var envVariablesTyped_1 = __importDefault(require("./shared/envVariablesTyped"));
var SERVER_PORT = envVariablesTyped_1.default.SERVER_PORT;
var server = express_1.default();
server
    .use(cors_1.default())
    .use(router_1.default);
server.listen(SERVER_PORT, function () {
    console.log("Express server running on port " + SERVER_PORT);
    var now = moment_1.default().format('h:mm:ss a [on] MMM Do[,] YYYY');
    console.log("Last restarted: " + now);
});
//# sourceMappingURL=server.js.map