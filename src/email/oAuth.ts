import path from 'path';

import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';

/* eslint-disable no-console */

const credentialsFilePath = path.join(__dirname, '../../', 'oauthKeyFile2.json');

// If modifying these scopes, delete token.json.
const scopes = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
];

const gmail = google.gmail('v1');

async function runSample() {
  // Obtain user credentials to use for the request
  const auth = await authenticate({
    keyfilePath: credentialsFilePath,
    scopes,
  });

  google.options({ auth });

  const subject = 'Hello';
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    'From: Justin Beckwith <beckwith@google.com>',
    'To: Justin Beckwith <beckwith@google.com>',
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    'This is a message just to say hello.',
    'So... <b>Hello!</b> ',
  ];
  const message = messageParts.join('\n');

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(res.data);
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
}

runSample();
