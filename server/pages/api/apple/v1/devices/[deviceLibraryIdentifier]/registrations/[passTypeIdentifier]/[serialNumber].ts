import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../../../../../../utils/SupabaseClient'

/**
 * Register a Pass for Update Notifications. Implementation of 
 * https://developer.apple.com/documentation/walletpasses/register_a_pass_for_update_notifications
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[serialNumber].js')

  // Expected URL format:
  //   /api/apple/v1/devices/[deviceLibraryIdentifier]/registrations/[passTypeIdentifier]/[serialNumber]
  //   /api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/333
  console.log('req.url:', req.url)

  try {
    // Expected request method:  POST
    console.log('req.method:', req.method)
    if (req.method != 'POST') {
      throw new Error('Wrong request method: ' + req.method)
    }

    // Extract variables from the request query
    console.log('req.query:', req.query)
    const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } = req.query
    console.log('deviceLibraryIdentifier:', deviceLibraryIdentifier)
    console.log('passTypeIdentifier:', passTypeIdentifier)
    console.log('serialNumber:', serialNumber)

    // Extract authentication token from the "Authorization" header
    // Expected format:
    //   'Authorization': 'ApplePass 0x3fbeb3ae33af3fb33f3d33333303d333a333aff33f3133efbc3330333adb333a'
    const authorizationHeader : any = req.headers.authorization
    console.log('authorizationHeader:', authorizationHeader)
    const authenticationToken : string = authorizationHeader?.split(' ')[1]
    console.log('authenticationToken:', authenticationToken)
    if (!authenticationToken || String(authenticationToken).trim().length == 0) {
      throw new Error('Missing/empty header: Authorization')
    }

    // Authenticate the request using a shared secret
    // TODO

    // Extract push token from the request body (application/json)
    // Expected format:
    //   {
    //     pushToken: '333d0b3c3f3b3a330f3d0333333b33a3b0f33c33b333a333333ece3ab33333c3'
    //   }
    const pushToken : string = req.body.pushToken
    console.log('pushToken:', pushToken)
    if (!pushToken || String(pushToken).trim().length == 0) {
      throw new Error('Missing/empty body: pushToken')
    }

    // Register the pass
    supabase
        .from('registrations')
        .insert([{ device_library_identifier: deviceLibraryIdentifier, serial_number: serialNumber, push_token: pushToken }])
        .then((result: any) => {
          console.log('result:', result)
          if (result.error) {
            res.status(401).json({
              error: 'Request Not Authorized: ' + result.error.message
            })
            return
          } else {
            res.status(201).json({
              message: 'Registration Successful'
            })
          }
        })
  } catch (err: any) {
    console.error('[serialNumber].js err:\n', err)
    res.status(401).json({
      error: 'Request Not Authorized: ' + err.message
    })
  }
}
