import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Log a messages. Implementation of 
 * https://developer.apple.com/documentation/walletpasses/log_a_message
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('log.ts')

  console.log('req.url:', req.url)

  try {
    // Expected request method:  POST
    console.log('req.method:', req.method)
    if (req.method != 'POST') {
      throw new Error('Wrong request method: ' + req.method)
    }

    // Display the log entries in the request body (application/json)
    console.log('req.body:', req.body)

    res.status(200).json({
      message: 'OK'
    })
  } catch (err: any) {
    console.error('log.ts err:\n', err)
    res.status(401).json({
      error: 'Request Not Authorized: ' + err.message
    })
  }
}
