import * as AWS from 'aws-sdk'
import envTyped from '../../../shared/envVariablesTyped';

const {
  API_VERSION,
  SECRET_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  REGION
} = envTyped;

export default class AWSSimpleEmailServiceFactory {
  private static _instance: AWS.SES

  public static getAWSSimpleEmailServiceInstance() {
    if (this._instance) {
      return this._instance
    } else {
      this._instance = new AWS.SES(
        {
          "apiVersion": API_VERSION,
          "accessKeyId": SECRET_ACCESS_KEY_ID,
          "secretAccessKey": SECRET_ACCESS_KEY,
          "region": REGION
        }
      )
      return this._instance
    }
  }
}
