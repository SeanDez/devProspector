"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var hubspot = __importStar(require("@hubspot/api-client"));
var envVariablesTyped_1 = __importDefault(require("./shared/envVariablesTyped"));
var HUBSPOT_API_KEY = envVariablesTyped_1.default.HUBSPOT_API_KEY;
/*
  Get all contacts that have not been contacted and have emails

  For each selection
  Send each one an email
  Kick out contacts where all contact attempts failed
  if email was a success
    create an email event in hubspot
    change status to contacted (or similar)
*/
var hubspotClient = new hubspot.Client({ apiKey: HUBSPOT_API_KEY });
//# sourceMappingURL=index.js.map