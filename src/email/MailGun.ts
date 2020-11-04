import buildUrl from 'build-url';
import 'es6-promise';
import 'isomorphic-fetch';
import mailgunUnconnected from 'mailgun-js';

import envTyped from '../shared/envVariablesTyped';
import Mailformatter from './Mailformatter';

const {
  MAILGUN_PRIVATE_API_KEY,
  MAILGUN_DOMAIN,
} = envTyped;
const apiBaseUrl = 'https://api.mailgun.net/';

const mailgun = mailgunUnconnected({
  apiKey: MAILGUN_PRIVATE_API_KEY,
  domain: MAILGUN_DOMAIN,
});

class MailGun extends Mailformatter{

  public async validate(suspectEmail: string) {
    const validationEndpoint = buildUrl(apiBaseUrl, {
      path: '/v4/address/validate',
      queryParams: {
        address: suspectEmail,
      },
    });

    try {
      const base64Credentials = Buffer.from(`api:${MAILGUN_PRIVATE_API_KEY}`).toString('base64');

      const response = await fetch(validationEndpoint, {
        method: 'get',
        headers: {
          authorization: `Basic ${base64Credentials}`,
        },
      });

      const jsonData = await response.json();
      return jsonData;
    } catch ({ name, message }) {
      return { name, message };
    }
  }

  public async sendMessage(raw:any) {
    return new Promise((resolve, reject) => {
      mailgun.messages().send(
        raw,
        (error, mailgunDetails) => {
          if (error) { reject(error); }
          resolve(mailgunDetails);
        },
      );
    });
  }
}
export default MailGun