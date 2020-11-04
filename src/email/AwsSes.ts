import SimpleEmailService from "./aws-ses/service/simpleEmailService"
import envTyped from '../shared/envVariablesTyped';
import Mailformatter from "./Mailformatter";

const {
  FROM_EMAIL
} = envTyped;

class AwsSes extends Mailformatter{

  public async sendMessage(raw:any){
    const emailParams = {
      Destination: {
        CcAddresses: [raw.from],
        ToAddresses: [raw.from]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: raw.text
          },
          Text: {
            Charset: 'UTF-8',
            Data: raw.text
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: raw.subject
        }
      },
      Source: raw.from,
      ReplyToAddresses: [raw.from]
    }

    await SimpleEmailService.sendEmailByAWSSES(emailParams)
  }
}
export default AwsSes