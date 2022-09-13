import { NextApiRequest, NextApiResponse } from 'next'
import { Platform } from '../../interfaces'
import { config } from '../../utils/Config'
import { Passes } from '../../utils/Passes'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('/admin/pushLastUpdate')

  Passes.notifyPassesAboutLastUpdate(Platform.Apple)
    .then((result: string) => {
      console.log('then, result:', result)
      res.status(200).json({
        message: 'OK: ' + result
      })
    })
    .catch((result: string) => {
      console.log('catch, result:', result)
      res.status(500).json({
        error: 'Internal Server Error: ' + result
      })
    })
}
