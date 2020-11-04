/* eslint-disable no-console */
import 'es6-promise';
import 'isomorphic-fetch';
import EProspectCategories from './EProspectCategories';
import envTyped from '../shared/envVariablesTyped';

const {
    PORTFOLIO_LINK
} = envTyped;

const goodTitles = {
    help: 'I need your help',
    noSubject: '(no subject)',
    question: 'Question', // top performer, but used heavily
    timeTodayTomorrow: 'Do you have time to meet today/tomorrow?',
    sorryIMissedYou: 'Sorry I missed you...', // invokes curiosity. But hard to transition
    tryingToConnect: 'trying to connect', // name tends to boost response
};

class Mailformatter {

    public makeBody(messageDetails: any) {
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

    public getMessageTitle(firstName: string, prospectCategory: EProspectCategories) {
        if (prospectCategory === EProspectCategories.recruiter) {
            return goodTitles.question;
        }

        return `${firstName}, ${goodTitles.help}`;
    }

    public stripEndingPeriods(rawSentence: string) {
        const endingPeriods = /\.+$/;
        const strippedSentence = rawSentence.replace(endingPeriods, '');
        return strippedSentence;
    }

    public getMessageBody(firstName: string, prospectCategory: EProspectCategories,
        companyName: string, introCompliment: string) {
        /* eslint-disable no-param-reassign */

        if (prospectCategory === EProspectCategories.sales) {
            prospectCategory = EProspectCategories.technical;
        }
        const normalizedIntroCompliment = this.stripEndingPeriods(introCompliment);

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

    public convertToProspectCategory(roleCode: string) {
        const normalizedCode = roleCode.toUpperCase();

        if (normalizedCode === 'R') {
            return EProspectCategories.recruiter;
            // eslint-disable-next-line no-else-return
        } else if (normalizedCode === 'S') {
            return EProspectCategories.sales;
        }

        return EProspectCategories.technical;
    }

    public formattedMessage(firstName: string, companyName: string, fromEmail: string, toEmail: string,
            prospectCategory: EProspectCategories,
            introCompliment: string): any {
            const messageTitle = this.getMessageTitle(firstName, prospectCategory);
            const messageBody = this.getMessageBody(firstName, prospectCategory, companyName, introCompliment);
      
            const messageDetails = {
              from: fromEmail,
              to: toEmail,
              subject: messageTitle,
              text: messageBody,
            };
            
            return messageDetails;
    }
}
export default Mailformatter