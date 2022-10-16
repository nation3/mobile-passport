import { NextApiRequest, NextApiResponse } from 'next'
import { config } from '../../../../../../../utils/Config'
import { supabase } from '../../../../../../../utils/SupabaseClient'

/**
 * Get the List of Updatable Passes.  Implementation of 
 * https://developer.apple.com/documentation/walletpasses/get_the_list_of_updatable_passes
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[passTypeIdentifier].ts')

  // Expected URL format:
  //   /api/apple/v1/devices/[deviceLibraryIdentifier]/registrations/[passTypeIdentifier]?passesUpdatedSince=[previousLastUpdated]
  //   /api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3?passesUpdatedSince=1662541136
  console.log('req.url:', req.url)

  try {
    // Expected request method:  GET
    console.log('req.method:', req.method)
    if (req.method != 'GET') {
      throw new Error('Wrong request method: ' + req.method)
    }

    // Extract deviceLibraryIdentifier and passesUpdatedSince from the request query
    console.log('req.query:', req.query)
    const { deviceLibraryIdentifier, passesUpdatedSince } = req.query
    console.log('deviceLibraryIdentifier:', deviceLibraryIdentifier)
    console.log('passesUpdatedSince:', passesUpdatedSince)

    // Lookup the serial numbers for the given device
    supabase
        .from('registrations')
        .select('serial_number')
        .eq('device_library_identifier', deviceLibraryIdentifier)
        .then((result: any) => {
          console.log('result:', result)
          if (result.error) {
            res.status(500).json({
              error: 'Internal Server Error: ' + result.error.message
            })
          } else {
            // Convert from [{serial_number:333},{serial_number:444}] to ["333","444"]
            let serialNumbers : string[] = []
            for (const index in result.data) {
              const serialNumber : string = result.data[index]['serial_number']
              serialNumbers[Number(index)] = String(serialNumber)
            }
            console.log('serialNumbers:\n', serialNumbers)
            
            if (serialNumbers.length == 0) {
              // There are no matching passes
              res.status(204).end()
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
                      // Convert from ISO string to Date
                      const latestUpdateDate: Date = new Date(latest_updates_result.data['time'])
                      console.log('latestUpdateDate:', latestUpdateDate)

                      if (!passesUpdatedSince) {
                        // The passes on this device have not been updated previously, so return all passes.
                        res.status(200).json({
                          serialNumbers: serialNumbers,
                          lastUpdated: String(Math.round(latestUpdateDate.getTime() / 1000))
                        })
                      } else {
                        // The passes on this device have been updated previously, so only return passes that 
                        // were updated before the most recent Nation3 update in the `latest_updates` database table.

                        // Convert from epoch timestamp string to Date
                        const passesUpdatedSinceDate: Date = new Date(Number(passesUpdatedSince) * 1000)
                        console.log('passesUpdatedSinceDate:', passesUpdatedSinceDate)
                        
                        if (passesUpdatedSinceDate.getTime() < latestUpdateDate.getTime()) {
                          res.status(200).json({
                            serialNumbers: serialNumbers,
                            lastUpdated: String(Math.round(latestUpdateDate.getTime() / 1000))
                          })
                        } else {
                          res.status(204).end()
                        }
                      }
                    }
                  })
            }
          }
        })
  } catch (err: any) {
    console.error('[passTypeIdentifier].ts err:\n', err)
    res.status(400).json({
      error: 'Request Not Authorized: ' + err.message
    })
  }
}
