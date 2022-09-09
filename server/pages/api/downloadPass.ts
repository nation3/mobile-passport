import { NextApiRequest, NextApiResponse } from 'next'
import { ApplePass, Platform } from '../../interfaces'
import { Passes } from '../../utils/Passes'
const Web3 = require('web3')
import fs from 'fs'
import PassportIssuer from '../../abis/PassportIssuer.json'
import Passport from '../../abis/Passport.json'
import { ethers } from 'ethers'
import { config } from '../../utils/Config'
import { supabase } from '../../utils/SupabaseClient'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('/api/downloadPass')

  try {
    const { address } = req.query
    console.log(`address: "${address}"`)

    // Instantiate a Web3 object
    const infuraEndpointURI = `wss://${config.chain}.infura.io/ws/v3/${config.inpuraApiKey}`
    console.log('infuraEndpointURI:', infuraEndpointURI)
    const web3 = new Web3(infuraEndpointURI)

    // Check that the address is valid
    if (!web3.utils.isAddress(address)) {
      console.error('Invalid address:', address)
      throw new Error('Invalid address')
    }

    const { signature } = req.query
    console.log(`signature: "${signature}"`)

    // Check that the signature is valid
    const signedMessage = 'I am the holder of this Nation3 passport'
    let recoveredAddress = undefined
    try {
      recoveredAddress = web3.eth.accounts.recover(signedMessage, signature)
    } catch (error: any) {
      console.error('Invalid signature:\n', error)
      throw new Error('Invalid signature', error)
    }
    console.log(`recoveredAddress: "${recoveredAddress}"`)
    if (address != recoveredAddress) {
      console.error('Invalid signature (address not recovered)')
      throw new Error('Invalid signature (address not recovered)')
    }

    const { platform } = req.query
    console.log(`platform: "${platform}"`)

    // Check that the platform is valid
    // TODO

    // Check that the address has a passport NFT
    const PassportIssuerContract = new web3.eth.Contract(
      PassportIssuer.abi,
      config.passportIssuerAddress
    )
    PassportIssuerContract.methods
      .passportId(address)
      .call()
      .then((result: any) => {
        console.log('then result:', result)

        const passportID: string = result
        console.log('passportID:', passportID)

        // Lookup passport issue date
        const PassportContract = new web3.eth.Contract(
          Passport.abi,
          config.passportAddress
        )
        PassportContract.methods
          .timestampOf(passportID)
          .call()
          .then((timestamp: number) => {
            console.log('then timestamp:', timestamp)

            // Lookup ENS name
            // If something fails during the ENS lookup, use the ETH address as fallback
            let ensName: string = ''
            lookupEnsName(address)
              .then((result: any) => {
                console.log('then result:', result)
                if (result != null) {
                  ensName = result
                } else {
                  console.warn('ENS name not found for address')
                }
              })
              .catch((error) => {
                console.error('Failed to get a response from ENS:', error)
              })
              .finally(() => {
                console.log('finally')

                console.log('ensName:', ensName)

                // Store pass details (needed for sending updated passes in the future)
                const platform: Platform = Platform.Apple
                const templateVersion: number = config.appleTemplateVersion
                const download = {
                  platform: Platform[platform],
                  template_version: templateVersion,
                  passport_id: passportID,
                  issue_date: new Date(timestamp * 1000),
                  address: address,
                  ens_name: ensName
                }
                console.log('download:\n', download)
                supabase
                    .from('downloads')
                    .insert(download)
                    .then((result: any) => {
                      console.log('then result:\n', result)
                      if (result.error) {
                        res.status(500).json({
                          error: 'Internal Server Error: ' + result.error.message
                        })
                      } else {
                        // Populate the pass template
                        const filePath: string = Passes.generatePass(
                          platform,
                          templateVersion,
                          passportID,
                          timestamp,
                          address,
                          ensName
                        )
                        console.log('filePath:', filePath)
        
                        // Serve the pass download to the user
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
                      }
                    })
              })
          })
          .catch((error: any) => {
            console.error('catch error:\n', error)
            res.status(500).json({
              error: 'Looking up passport issue date failed',
            })
            return
          })
      })
      .catch((error: any) => {
        console.error('catch error:\n', error)
        res.status(400).json({
          error: 'Passport ID not found for address',
        })
        return
      })
  } catch (err: any) {
    console.error('/api/downloadPass err:\n', err)
    res.status(400).json({
      error: err.message,
    })
  }
}

/**
 * Check if the address reverse-resolves to an ENS name.
 *
 * @param address The Ethereum address
 * @returns Promise
 */
const lookupEnsName = async (address: any): Promise<null | string> => {
  console.log('lookupEnsName address:', address)

  const infuraProvider = new ethers.providers.InfuraProvider(
    (config.chain == 'goerli') ? 'goerli' : 'homestead',
    config.inpuraApiKey
  )
  console.log('infuraProvider:\n', infuraProvider)

  var ensName = await infuraProvider.lookupAddress(address)
  console.log('ensName:', ensName)

  return ensName
}
