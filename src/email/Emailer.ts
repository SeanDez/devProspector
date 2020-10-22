import buildUrl from 'build-url';
import 'es6-promise';
import { Response } from 'express';
import 'isomorphic-fetch';
import mailgunUnconnected from 'mailgun-js';

import envTyped from '../shared/envVariablesTyped';
import EProspectCategories from './EProspectCategories';

const {
  MAILGUN_PUBLIC_VALIDATION_KEY, MAILGUN_PRIVATE_API_KEY,
  MAILGUN_SENDER, PORTFOLIO_LINK, MAILGUN_DOMAIN,
} = envTyped;
const apiBaseUrl = 'https://api.mailgun.net/';

const mailgun = mailgunUnconnected({
  apiKey: MAILGUN_PRIVATE_API_KEY,
  domain: MAILGUN_DOMAIN,
});

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
    async validate(suspectEmail: string) {
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
    },

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

    async send(firstName: string, companyName: string, fromEmail: string, toEmail: string,
      prospectCategory: EProspectCategories,
      introCompliment: string): Promise<{ id: string, message?: string, error?: string }> {
      const messageTitle = getMessageTitle(firstName, prospectCategory);
      const messageBody = getMessageBody(firstName, prospectCategory, companyName, introCompliment);

      const messageDetails = {
        from: fromEmail,
        to: toEmail,
        subject: messageTitle,
        text: messageBody,
      };

      return new Promise((resolve, reject) => {
        mailgun.messages().send(
          messageDetails,
          (error, mailgunDetails) => {
            if (error) { reject(error); }
            resolve(mailgunDetails);
          },
        );
      });
    },
  };
};
