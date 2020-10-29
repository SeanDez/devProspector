import 'es6-promise';
import 'isomorphic-fetch';

import EProspectCategories from './EProspectCategories';
import * as fs from 'fs';
import * as readline from 'readline';
import {google} from 'googleapis';
import envTyped from '../shared/envVariablesTyped';

const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];
const TOKEN_PATH = 'token.json';
const {
    PORTFOLIO_LINK
  } = envTyped;
/*
  Closure factory for email sending

  Validation requires paid plan, starting at $35/month at Mailgun
*/
export default () => {
  const goodTitles = {
    help: 'I need your help',
    noSubject: '(no subject)',
    question: 'Question', // top performer, but used heavily
    timeTodayTomorrow: 'Do you have time to meet today/tomorrow?',
    sorryIMissedYou: 'Sorry I missed you...', // invokes curiosity. But hard to transition
    tryingToConnect: 'trying to connect', // name tends to boost response
  };

  // private methods
  function authorize(credentials:any, callback:any, raw:any) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token:any) => {
      if (err) return getNewToken(oAuth2Client, callback, raw);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client, raw);
    });
  }
  
  function getNewToken(oAuth2Client:any, callback:any, raw:any) {
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
  
  function makeBody(messageDetails:any) {
    var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", messageDetails.to, "\n",
        "from: ", messageDetails.from, "\n",
        "subject: ", messageDetails.subject, "\n\n",
        messageDetails.text
    ].join('');
  
    var encodedMail = Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
  
  }
  
  function sendMessage(auth:any, raw:any) {
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

  function getMessageTitle(firstName: string, prospectCategory: EProspectCategories) {
    if (prospectCategory === EProspectCategories.recruiter) {
      return goodTitles.question;
    }

    return `${firstName}, ${goodTitles.help}`;
  }

  function stripEndingPeriods(rawSentence: string) {
    const endingPeriods = /\.+$/;
    const strippedSentence = rawSentence.replace(endingPeriods, '');
    return strippedSentence;
  }

  function getMessageBody(firstName: string, prospectCategory: EProspectCategories,
    companyName: string, introCompliment: string) {
    /* eslint-disable no-param-reassign */

    if (prospectCategory === EProspectCategories.sales) {
      prospectCategory = EProspectCategories.technical;
    }
    const normalizedIntroCompliment = stripEndingPeriods(introCompliment);

    const messageBodies = {
      R: `Hi ${firstName},
  
      ${normalizedIntroCompliment}. By the way, ${companyName} is hiring right now, right? Would you consider me as a Full Stack JS developer? Here's a link to my work: ${PORTFOLIO_LINK}
      
      If you like what you see and there's a need I'd love to schedule a time to talk about this further. Let me know!`,
      S: '', // unused for now
      T: `Hi ${firstName},
    
      ${normalizedIntroCompliment}. By the way, I'm looking for the right person to talk to at ${companyName} to get hired as a full stack JS dev. Do you know who to contact? 
      
      Alternatively you can pass my info to them. mrseandezoysa@gmail.com is my email. And here's my portfolio link with resume page: ${PORTFOLIO_LINK}`,
    };
    return messageBodies[prospectCategory];
  }

  // public methods
  return {
    convertToProspectCategory(roleCode: string) {
      const normalizedCode = roleCode.toUpperCase();

      if (normalizedCode === 'R') {
        return EProspectCategories.recruiter;
        // eslint-disable-next-line no-else-return
      } else if (normalizedCode === 'S') {
        return EProspectCategories.sales;
      }

      return EProspectCategories.technical;
    },

    send(firstName: string, companyName: string, fromEmail: string, toEmail: string,
      prospectCategory: EProspectCategories,
      introCompliment: string): any {
      const messageTitle = getMessageTitle(firstName, prospectCategory);
      const messageBody = getMessageBody(firstName, prospectCategory, companyName, introCompliment);

      const messageDetails = {
        from: fromEmail,
        to: toEmail,
        subject: messageTitle,
        text: messageBody,
      };
      const raw = makeBody(messageDetails);
      fs.readFile('oauthKeyFile.json', (err:any, content:any) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Gmail API.
            authorize(JSON.parse(content), sendMessage, raw);
      });
      
    },
  };
};
