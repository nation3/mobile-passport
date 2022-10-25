import apn, { Responses } from 'apn'
import { config } from './Config';

/**
 * Apple Push Notification (APN) provider.
 */
export class APNProvider {

  static async sendNotification(pushToken: string): Promise<Responses> {
    console.info('[APNProvider.ts] sendNotification')

    const apnProvider: apn.Provider = new apn.Provider({
      cert: `-----BEGIN CERTIFICATE-----\n${config.appleCertificatePEM}\n-----END CERTIFICATE-----`,
      key: `-----BEGIN RSA PRIVATE KEY-----\n${config.appleCertificateKey}\n-----END RSA PRIVATE KEY-----`,
      production: true
    })
    const notification: apn.Notification = new apn.Notification();
    notification.topic = 'pass.org.passport.nation3'
    console.info('[APNProvider.ts] Sending notification...')
    return await apnProvider.send(notification, pushToken)
  }
}
