import { NextApiRequest, NextApiResponse } from 'next'
import { Platform } from '../../interfaces'
import { config } from '../../utils/Config'
import { Passes } from '../../utils/Passes'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.info('[pushLastUpdate.ts] handler')

  Passes.notifyPassesAboutLastUpdate(Platform.Apple)
    .then((result: any) => {
      console.info('[pushLastUpdate.ts] then, result:', result)
      res.status(200).json(
        JSON.parse(result)
      )
    })
    .catch((result: any) => {
      console.error('[pushLastUpdate.ts] catch, result:', result)
      res.status(500).json({
        error: 'Internal Server Error: ' + result
      })
    })
}
