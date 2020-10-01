"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var readline_1 = __importDefault(require("readline"));
var googleapis_1 = require("googleapis");
/* eslint-disable no-console */
var googleCredentialsFilePath = path_1.default.join(__dirname, '../', 'devProspectorGoogleCredentials.json');
// If modifying these scopes, delete token.json.
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
var TOKEN_PATH = 'token.json';
// Load client secrets from a local file.
var googleCredentials = fs_1.default.readFileSync(googleCredentialsFilePath);
if (typeof googleCredentials === 'undefined') {
    throw new Error('Error loading client secret file');
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    var authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    var rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oAuth2Client.getToken(code, function (err, token) {
            if (err) {
                throw new Error("Error retrieving access token " + err);
            }
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs_1.default.writeFile(TOKEN_PATH, JSON.stringify(token), function (err2) {
                if (err2) {
                    throw new Error("Error retrieving access token " + err2);
                }
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
    var gmail = googleapis_1.google.gmail({ version: 'v1', auth: auth });
    gmail.users.labels.list({
        userId: 'me',
    }, function (err, res) {
        if (err) {
            throw new Error("The API returned an error: " + err);
        }
        if (Boolean(res) === false) {
            throw new Error('res is falsy');
        }
        var labels = res.data.labels;
        if (labels && labels.length) {
            console.log('Labels:');
            labels.forEach(function (label) {
                console.log("- " + label.name);
            });
        }
        else {
            console.log('No labels found.');
        }
    });
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var _a = credentials.installed, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris;
    var oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs_1.default.readFile(TOKEN_PATH, 'utf8', function (err, token) {
        if (err)
            getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}
authorize(googleCredentials, listLabels);
