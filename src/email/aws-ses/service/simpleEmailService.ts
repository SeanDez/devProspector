/* eslint-disable no-console */
import AWSSimpleEmailServiceFactory from './awsSimpleEmailServiceFactory'
import SimpleEmailParam from '../param/simpleEmailParam'

class SimpleEmailService {
  public static async sendEmailByAWSSES(
    emailParam: SimpleEmailParam
  ): Promise<any> {
    let results: any
    try {
      results = await AWSSimpleEmailServiceFactory.getAWSSimpleEmailServiceInstance()
        .sendEmail(emailParam)
        .promise()
    } catch (err) {
      console.log(err)
    }
    return results
  }
}
export default SimpleEmailService
