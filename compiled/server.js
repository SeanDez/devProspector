"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var express_basic_auth_1 = __importDefault(require("express-basic-auth"));
var moment_1 = __importDefault(require("moment"));
var router_1 = __importDefault(require("./customProperties/router"));
var router_2 = __importDefault(require("./contact/router"));
var router_3 = __importDefault(require("./email/router"));
var envVariablesTyped_1 = __importDefault(require("./shared/envVariablesTyped"));
var SERVER_PORT = envVariablesTyped_1.default.SERVER_PORT, EXPRESS_USERNAME = envVariablesTyped_1.default.EXPRESS_USERNAME, EXPRESS_PASSWORD = envVariablesTyped_1.default.EXPRESS_PASSWORD;
// --------------- Auth route setup
var validUsers = (_a = {}, _a[EXPRESS_USERNAME] = EXPRESS_PASSWORD, _a);
function handleAuthenticationResponse(req, res, next) {
    if (req.auth) {
        res.status(204).send();
    }
}
// -------------- Middleware and router attachment
var server = express_1.default();
server
    .use(body_parser_1.default.json())
    .use(body_parser_1.default.urlencoded({ extended: false }))
    .use(cors_1.default())
    .post('/login', express_basic_auth_1.default({
    users: validUsers,
}), handleAuthenticationResponse)
    .use(router_1.default)
    .use('/contact', router_2.default)
    .use('/email', router_3.default);
// to be deleted after dev phase
server.get('/', function (req, res) {
    res.json({ message: 'this endpoint is just for basic server testing' });
});
server.listen(SERVER_PORT, function () {
    console.log("Express server running on port " + SERVER_PORT);
    var now = moment_1.default().format('h:mm:ssa [on] MMM Do[,] YYYY');
    console.log("Last restarted: " + now);
});
//# sourceMappingURL=server.js.map