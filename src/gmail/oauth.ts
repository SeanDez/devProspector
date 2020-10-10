import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { google } from 'googleapis';

/* eslint-disable no-console */

const googleCredentialsFilePath = path.join(__dirname, '../../', 'oauthKeyFile.json');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
const googleCredentials = fs.readFileSync(googleCredentialsFilePath);

if (typeof googleCredentials === 'undefined') {
  throw new Error('Error loading client secret file');
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client: any, callback: Function) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err: any, token: string) => {
      if (err) {
        throw new Error(`Error retrieving access token ${err}`);
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err2) => {
        if (err2) {
          throw new Error(`Error retrieving access token ${err2}`);
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
function listLabels(auth: any) {
  const gmail = google.gmail({ version: 'v1', auth });

  const labels = gmail.users.labels.list({ userId: 'me' },
    (err, res) => {
      if (err) { throw new Error(`The API returned an error: ${err}`); }
      if (Boolean(res) === false) { throw new Error('res is falsy'); }

      const { labels } = res!.data;
      if (labels && labels.length) { return labels; }
      return 'No labels found.';
    });

  console.log(labels);
  return labels;
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
export function authorize(credentials: any, callback: Function) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0],
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, 'utf8', (err, token) => {
    if (err) getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// disable this after first run
authorize(googleCredentials, listLabels);

export default authorize;
