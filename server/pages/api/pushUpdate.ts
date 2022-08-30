import { NextApiRequest, NextApiResponse } from 'next'
import { Passes } from '../../utils/Passes'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('/api/pushUpdate')

  // Push update of new template
  console.log('Pushing template update...')

  const templateFormatVersion: number = 2
  const updateSent: boolean = Passes.pushUpdate(templateFormatVersion)

  res
    .status(200)
    .json({
      updateSent: updateSent,
      templateFormatVersion: templateFormatVersion,
    })
}
