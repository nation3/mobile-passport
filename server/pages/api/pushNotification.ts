import { NextApiRequest, NextApiResponse } from 'next'
import { Passes } from '../../utils/Passes'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('/api/pushNotification')

  // Push notification to all the passes
  console.log('Pushing notification...')

  const { title } = req.query
  console.log(`title: "${title}"`)
  if (!title || String(title).trim().length == 0) {
    res.status(400).json({ error: 'Missing/empty parameter: title' })
    return
  }

  const { content } = req.query
  console.log(`content: "${content}"`)
  if (!content || String(content).trim().length == 0) {
    res.status(400).json({ error: 'Missing/empty parameter: content' })
    return
  }

  // Remove leading/trailing whitespace
  const trimmedTitle = String(title).trim()
  const trimmedContent = String(content).trim()

  // Push notification
  const notificationSent: boolean = Passes.pushNotification(
    trimmedTitle,
    trimmedContent
  )
  console.log('notificationSent:', notificationSent)

  res.status(200).json({
    notificationSent: notificationSent,
    title: trimmedTitle,
    content: trimmedContent,
  })
}
