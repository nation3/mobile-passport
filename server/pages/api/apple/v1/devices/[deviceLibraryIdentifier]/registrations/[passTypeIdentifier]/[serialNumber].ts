import { NextApiRequest, NextApiResponse } from 'next'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[serialNumber].js')

  // Expected URL format:  /api/apple/v1/devices/[deviceLibraryIdentifier]/registrations/[passTypeIdentifier]/[serialNumber]
  console.log('req.url:', req.url)

  // Expected request method:  POST
  console.log('req.method:', req.method)

  // Extract variables from the request query
  console.log('req.query:', req.query)
  const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } = req.query
  console.log('deviceLibraryIdentifier:', deviceLibraryIdentifier)
  console.log('passTypeIdentifier:', passTypeIdentifier)
  console.log('serialNumber:', serialNumber)

  // Authenticate the request using a shared secret
  // TODO

  // Register the pass
  // TODO

  res.status(418).json({
    statusCode: 418,
    statusMessage: "I'm a teapot"
  })
}
