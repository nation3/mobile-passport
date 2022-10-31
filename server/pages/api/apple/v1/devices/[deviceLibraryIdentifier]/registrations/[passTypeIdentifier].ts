import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../../../../../utils/SupabaseClient'
import { DateUtils } from '../../../../../../../utils/DateUtils'

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
    lookupSerialNumbersFromDatabase(deviceLibraryIdentifier)
      .then((serialNumbers: string[]) => {
        console.log('then, serialNumbers:', serialNumbers)
        if (serialNumbers.length == 0) {
          // There are no matching passes
          res.status(204).end()
        } else {
          // Lookup the latest update and its timestamp
          lookupTimeOfLatestUpdate()
            .then((latestUpdateDate: Date) => {
              console.log('then, latestUpdateDate:', latestUpdateDate)
              if (!passesUpdatedSince) {
                // The passes on this device have not been updated previously, so return all passes.
                res.status(200).json({
                  serialNumbers: serialNumbers,
                  lastUpdated: String(DateUtils.getTimeInSeconds(latestUpdateDate))
                })
              } else {
                // The passes on this device have been updated previously, so only return passes that 
                // were updated before the most recent Nation3 update in the `latest_updates` database table.

                // Convert from epoch timestamp string ('1662889385') to Date
                const passesUpdatedSinceDate: Date = DateUtils.getDate(Number(passesUpdatedSince))
                console.log('passesUpdatedSinceDate:', passesUpdatedSinceDate)
                
                if (passesUpdatedSinceDate.getTime() < latestUpdateDate.getTime()) {
                  res.status(200).json({
                    serialNumbers: serialNumbers,
                    lastUpdated: String(DateUtils.getTimeInSeconds(latestUpdateDate))
                  })
                } else {
                  res.status(204).end()
                }
              }
            })
            .catch((error: any) => {
              console.log('catch, error:', error)
              res.status(500).json({
                error: 'Internal Server Error: ' + error.message
              })
            })
        }
      })
      .catch((error: any) => {
        console.log('catch, error:', error)
        res.status(500).json({
          error: 'Internal Server Error: ' + error.message
        })
      })
  } catch (err: any) {
    console.error('[passTypeIdentifier].ts err:\n', err)
    res.status(400).json({
      error: 'Request Not Authorized: ' + err.message
    })
  }
}

/**
 * Makes a database query for fetching the serial numbers of passes stored in a device.
 * 
 * @param deviceLibraryIdentifier The identifier of the iOS device stored during pass registration
 * @returns A Promise with a string array of serial numbers
 */
const lookupSerialNumbersFromDatabase = async (deviceLibraryIdentifier: any): Promise<string[]> => {
  console.log('lookupSerialNumbersFromDatabase')

  const { data, error } = await supabase.from('registrations').select('serial_number').eq('device_library_identifier', deviceLibraryIdentifier)
  console.log('data:', data)
  console.log('error:', error)
  
  const promise: Promise<string[]> = new Promise((resolve, reject) => {
    if (error) {
      reject(error)
    } else {
      // Convert from [{serial_number:333},{serial_number:444}] to ["333","444"]
      let serialNumbers : string[] = []
      for (const index in data) {
        const serialNumber : string = data[index]['serial_number']
        serialNumbers[Number(index)] = String(serialNumber)
      }

      resolve(serialNumbers)
    }
  })
  return promise
}

/**
 * Makes a database query for fetching the most recent update, and then returns its timestamp (Date).
 * 
 * @returns A Promise with a Date
 */
const lookupTimeOfLatestUpdate = async (): Promise<Date> => {
  console.log('lookupTimeOfLatestUpdate')

  const { data, error } = await supabase.from('latest_updates').select('*').order('time', { ascending: false }).limit(1).single()
  console.log('data:', data)
  console.log('error:', error)

  const promise: Promise<Date> = new Promise((resolve, reject) => {
    if (error) {
      reject(error)
    } else {
      // Convert from ISO string ('2022-09-30T12:12:17') to Date
      const latestUpdateDate: Date = new Date(data['time'])
      console.log('latestUpdateDate:', latestUpdateDate)

      resolve(latestUpdateDate)
    }
  })
  return promise
}
