import { NextApiRequest, NextApiResponse } from 'next'
import { config } from '../../utils/Config'
import { Passes } from '../../utils/Passes'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('/api/pushUpdate')

  // Push update of new template
  console.log('Pushing template update...')

  const templateVersion: number = config.appleTemplateVersion
  const updateSent: boolean = Passes.pushUpdate(templateVersion)

  res
    .status(200)
    .json({
      updateSent: updateSent,
      templateVersion: templateVersion,
    })
}
