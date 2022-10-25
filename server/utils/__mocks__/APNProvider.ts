import { ResponseFailure, Responses, ResponseSent } from 'apn'

/**
 * Mock provider.
 */
export class APNProvider {

  static async sendNotification(pushToken: string): Promise<Responses> {
    console.info('[APNProvider.ts (mock)] sendNotification')

    return new Promise<Responses>((resolve) => {
      const responsesSent: ResponseSent[] = [{ device: pushToken }]
      const responsesFailed: ResponseFailure[] = []
      const responses: Responses = { sent: responsesSent, failed: responsesFailed }
      resolve(responses)
    })
  }
}
