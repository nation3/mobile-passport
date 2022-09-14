import { NextApiRequest, NextApiResponse } from 'next'
import { Platform } from '../../../../../../interfaces'
import { config } from '../../../../../../utils/Config'
import { Passes } from '../../../../../../utils/Passes'
import { supabase } from '../../../../../../utils/SupabaseClient'
import fs from 'fs'
import { AppleCryptoUtils } from '../../../../../../utils/AppleCryptoUtils'

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
    const expectedAuthenticationToken: string = AppleCryptoUtils.generateAuthenticationToken(String(serialNumber))
    console.log('expectedAuthenticationToken:', expectedAuthenticationToken)
    if (expectedAuthenticationToken != authenticationToken) {
      throw new Error('Invalid header: Authorization')
    }

    // Lookup the pass details stored in the downloads table when 
    // the pass for this address was last downloaded.
    supabase
        .from('downloads')
        .select('*')
        .eq('passport_id', serialNumber)
        .order('id', { ascending: false })
        .limit(1)
        .single()
        .then((result: any) => {
          console.log('result:', result)
          if (result.error) {
            res.status(500).json({
              error: 'Internal Server Error: ' + result.error.message
            })
          } else {
            // Lookup the latest update and its timestamp
            supabase
                .from('latest_updates')
                .select('*')
                .order('time', { ascending: false })
                .limit(1)
                .single()
                .then((latest_updates_result: any) => {
                  console.log('latest_updates_result:', latest_updates_result)
                  if (latest_updates_result.error) {
                    res.status(500).json({
                      error: 'Internal Server Error: ' + latest_updates_result.error.message
                    })
                  } else {
                    const latestUpdateDate: Date = new Date(latest_updates_result.data['time'])
                    const latestUpdateTitle: string = latest_updates_result.data['title']
                    const latestUpdateContent: string = latest_updates_result.data['content']

                    // Populate the pass template
                    const platform: Platform = Platform.Apple
                    const templateVersion: number = config.appleTemplateVersion
                    const passportID: string = String(serialNumber)
                    const issueDate: Date = new Date(result.data['issue_date'])
                    const issueDateTimestamp: number = Math.round(issueDate.getTime() / 1000)
                    const address: string = result.data['address']
                    const ensName: string = result.data['ens_name']
                    const filePath: string = Passes.generatePass(
                      platform,
                      templateVersion,
                      passportID,
                      issueDateTimestamp,
                      address,
                      ensName,
                      latestUpdateTitle,
                      latestUpdateContent
                    )
                    console.log('filePath:', filePath)
              
                    // Return the updated pass
                    const fileName = `passport_${address}_v${templateVersion}.pkpass`
                    console.log('fileName:', fileName)
                    res.setHeader('Last-Modified', Math.round(latestUpdateDate.getTime() / 1000))
                    res.setHeader('Content-Disposition', `attachment;filename=${fileName}`)
                    res.setHeader('Content-Type', 'application/vnd.apple.pkpass')
                    res.setHeader('Content-Length', fs.statSync(filePath).size)
                    const readStream = fs.createReadStream(filePath)
                    readStream.pipe(res)
                  }
                })
          }
        })
  } catch (err: any) {
    console.error('[serialNumber].ts err:\n', err)
    res.status(401).json({
      error: 'Request Not Authorized: ' + err.message
    })
  }
}
