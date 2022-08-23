import { NextApiRequest, NextApiResponse } from 'next'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[serialNumber].js')

  // Expected URL format:
  //   /api/apple/v1/devices/[deviceLibraryIdentifier]/registrations/[passTypeIdentifier]/[serialNumber]
  //   /api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/333
  console.log('req.url:', req.url)

  // Expected request method:  POST
  console.log('req.method:', req.method)
  if (req.method != 'POST') {
    res.status(400).json({
      statusCode: 400,
      statusMessage: "Invalid request method: " + req.method
    })
  }

  // Extract variables from the request query
  console.log('req.query:', req.query)
  const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } = req.query
  console.log('deviceLibraryIdentifier:', deviceLibraryIdentifier)
  console.log('passTypeIdentifier:', passTypeIdentifier)
  console.log('serialNumber:', serialNumber)

  // Extract variables from the request header
  console.log('req.headers:', req.headers)
  // TODO

  // Authenticate the request using a shared secret
  // TODO

  // Register the pass
  // TODO

  res.status(418).json({
    statusCode: 418,
    statusMessage: "I'm a teapot"
  })
}
