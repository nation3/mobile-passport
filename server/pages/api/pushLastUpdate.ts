import { NextApiRequest, NextApiResponse } from 'next'
import { Platform } from '../../interfaces'
import { config } from '../../utils/Config'
import { Passes } from '../../utils/Passes'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('/api/pushLastUpdate')

  Passes.notifyPassesAboutLastUpdate(Platform.Apple)
    .then((result: any) => {
      console.log('then, result:', result)
      res.status(200).json(
        JSON.parse(result)
      )
    })
    .catch((result: any) => {
      console.log('catch, result:', result)
      res.status(500).json({
        error: 'Internal Server Error: ' + result
      })
    })
}
