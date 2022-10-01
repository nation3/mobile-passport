import { NextApiRequest, NextApiResponse } from 'next'
import { AppleCryptoUtils } from '../../../../../../../../utils/AppleCryptoUtils'
import { config } from '../../../../../../../../utils/Config'
import { supabase } from '../../../../../../../../utils/SupabaseClient'

let response: NextApiResponse

/**
 * Register a Pass for Update Notifications. Implementation of 
 * https://developer.apple.com/documentation/walletpasses/register_a_pass_for_update_notifications
 * 
 * Also handled by this endpoint:
 * Unregister a Pass for Update Notifications. Implementation of 
 * https://developer.apple.com/documentation/walletpasses/unregister_a_pass_for_update_notifications
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[serialNumber].ts')

  response = res

  // Expected URL format:
  //   /api/apple/v1/devices/[deviceLibraryIdentifier]/registrations/[passTypeIdentifier]/[serialNumber]
  //   /api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/333
  console.log('req.url:', req.url)

  try {
    // Expected request method:  POST/DELETE
    console.log('req.method:', req.method)
    if ((req.method != 'POST') && (req.method != 'DELETE')) {
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
    const expectedAuthenticationToken: string = AppleCryptoUtils.generateAuthenticationToken(String(serialNumber))
    console.log('expectedAuthenticationToken:', expectedAuthenticationToken)
    if (expectedAuthenticationToken != authenticationToken) {
      throw new Error('Invalid header: Authorization')
    }

    if (req.method == 'POST') {
      // Extract push token from the request body (application/json)
      // Expected format:
      //   {
      //     pushToken: '333d0b3c3f3b3a330f3d0333333b33a3b0f33c33b333a333333ece3ab33333c3'
      //   }
      const pushToken : String = req.body.pushToken
      console.log('pushToken:', pushToken)
      if (!pushToken || pushToken.trim().length == 0) {
        throw new Error('Missing/empty body: pushToken')
      }

      storeRegistrationInDatabase(String(deviceLibraryIdentifier), String(serialNumber), pushToken)
    } else if (req.method == 'DELETE') {
      deleteRegistrationFromDatabase(String(deviceLibraryIdentifier))
    }
  } catch (err: any) {
    console.error('[serialNumber].ts err:\n', err)
    handleResponse(401, 'Request Not Authorized: ' + err.message)
  }
}

function handleResponse(statusCode: number, statusMessage: string) {
  console.log('handleResponse')
  response.status(statusCode).json({
    message: statusMessage
  })
}

function storeRegistrationInDatabase(deviceLibraryIdentifier: String, serialNumber: String, pushToken: String) {
  console.log('Registering the pass in the database...')

  // Store the registration in the database
  supabase
      .from('registrations')
      .insert([{
        device_library_identifier: deviceLibraryIdentifier,
        template_version: config.appleTemplateVersion,
        serial_number: serialNumber,
        push_token: pushToken
      }])
      .then((result: any) => {
        console.log('result:', result)
        if (result.error) {
          if (result.error.message.includes('duplicate key value violates unique constraint')) {
            handleResponse(200, 'Serial Number Already Registered for Device')
          } else {
            handleResponse(500, 'Internal Server Error: ' + result.error.message)
          }
        } else {
          handleResponse(201, 'Registration Successful')
        }
      })
}

function deleteRegistrationFromDatabase(deviceLibraryIdentifier: String) {
  console.log('Deleting the pass registration from the database...')

  // Delete the registration from the database
  supabase
      .from('registrations')
      .delete()
      .match({ device_library_identifier: deviceLibraryIdentifier })
      .then((result: any) => {
        console.log('result:', result)
        if (result.error) {
          handleResponse(500, 'Internal Server Error: ' + result.error.message)
        } else {
          handleResponse(200, 'Device Unregistered')
        }
      })
}
