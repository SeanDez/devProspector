import 'es6-promise';
import 'isomorphic-fetch';

import * as fs from 'fs';
import * as readline from 'readline';
import {google} from 'googleapis';
import Mailformatter from './Mailformatter';

const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];
const TOKEN_PATH = 'token.json';

class Gmail extends Mailformatter{
  
  private authorize(credentials:any, callback:any, raw:any) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token:any) => {
      if (err) return this.getNewToken(oAuth2Client, callback, raw);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client, raw);
    });
  }
  
  private getNewToken(oAuth2Client:any, callback:any, raw:any) {
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
      oAuth2Client.getToken(code, (err:any, token:any) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client, raw);
      });
    });
  }

  public sendMessageFromGmail(auth:any, raw:any) {
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.messages.send({
        auth: auth,
        userId: 'me',
        requestBody: {
            raw: raw
        }
    }, function(err:any, response:any) {
      console.log(response)
    });
  }

  public sendMessage(raw:any) {
    fs.readFile('oauthKeyFile.json', (err:any, content:any) => {
      if (err) return console.log('Error loading client secret file:', err);
      this.authorize(JSON.parse(content), this.sendMessageFromGmail, raw);
  });
  }
  
}

export default Gmail