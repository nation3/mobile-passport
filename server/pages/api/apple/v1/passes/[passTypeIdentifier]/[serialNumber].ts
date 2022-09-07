import { NextApiRequest, NextApiResponse } from 'next'
import { Platform } from '../../../../../../interfaces'
import { config } from '../../../../../../utils/Config'
import { Passes } from '../../../../../../utils/Passes'
import { supabase } from '../../../../../../utils/SupabaseClient'
import fs from 'fs'

/**
 * Send an Updated Pass.  Implementation of 
 * https://developer.apple.com/documentation/walletpasses/send_an_updated_pass
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[serialNumber].ts')

  // Expected URL format:
  //   /api/apple/v1/passes/[passTypeIdentifier]/[serialNumber]
  //   /api/apple/v1/passes/pass.org.passport.nation3/333
  console.log('req.url:', req.url)

  try {
    // Expected request method:  GET
    console.log('req.method:', req.method)
    if (req.method != 'GET') {
      throw new Error('Wrong request method: ' + req.method)
    }

    // Extract variables from the request query
    console.log('req.query:', req.query)
    const { passTypeIdentifier, serialNumber } = req.query
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

    // Populate the pass template
    const templateVersion: number = config.appleTemplateVersion
    const passportID: string = String(serialNumber)
    const issueDateTimestamp: number = 0 // TODO
    const address: string = '<address>' // TODO
    const ensName: string = '<ensName>' // TODO
    const filePath: string = Passes.generatePass(
      Platform.Apple,
      templateVersion,
      passportID,
      issueDateTimestamp,
      address,
      ensName
    )
    console.log('filePath:', filePath)

    // Return the updated pass
    const fileName = `passport_${address}_v${templateVersion}.pkpass`
    console.log('fileName:', fileName)
    res.setHeader(
      'Content-Disposition',
      `attachment;filename=${fileName}`
    )
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass')
    res.setHeader('Content-Length', fs.statSync(filePath).size)
    const readStream = fs.createReadStream(filePath)
    readStream.pipe(res)
  } catch (err: any) {
    console.error('[serialNumber].ts err:\n', err)
    res.status(401).json({
      error: 'Request Not Authorized: ' + err.message
    })
  }
}
