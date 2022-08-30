import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../../../../../../utils/SupabaseClient'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[serialNumber].js')

  // Expected URL format:
  //   /api/apple/v1/devices/[deviceLibraryIdentifier]/registrations/[passTypeIdentifier]/[serialNumber]
  //   /api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/333
  console.log('req.url:', req.url)

  // Expected request method:  POST
  // console.log('req.method:', req.method)
  if (req.method != 'POST') {
    // Throw Error
    // TODO
  }

  // Extract variables from the request query
  // console.log('req.query:', req.query)
  const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } = req.query
  // console.log('deviceLibraryIdentifier:', deviceLibraryIdentifier)
  // console.log('passTypeIdentifier:', passTypeIdentifier)
  // console.log('serialNumber:', serialNumber)

  // Extract authentication token from the "authorization" header
  // Expected format:
  //   authorization: 'ApplePass 0x3fbeb3ae33af3fb33f3d33333303d333a333aff33f3133efbc3330333adb333a'
  const authorizationHeader : any = req.headers.authorization
  // console.log('authorizationHeader:', authorizationHeader)
  const authenticationToken : string = authorizationHeader?.split(' ')[1]
  // console.log('authenticationToken:', authenticationToken)

  // Authenticate the request using a shared secret
  // TODO

  console.log('req.headers:\n', req.headers)
  console.log('req.body:\n', req.body)
  // console.log('req:\n', req)

  // // Register the pass
  // supabase
  //     .from('registrations')
  //     .insert([{ device_library_identifier: deviceLibraryIdentifier, serial_number: serialNumber }])
  //     .then((result: any) => {
  //       console.log('result:', result)
  //       res.status(result.status).json({
  //         status: result.status,
  //         statusText: result.statusText
  //       })
  //     })
  res.status(201).json({
    status: 201,
    statusText: "Registration Successful"
  })
}
