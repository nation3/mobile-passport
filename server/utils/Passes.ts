import { Platform } from '../interfaces'
import { AppleCryptoUtils } from './AppleCryptoUtils'
import path from 'path'
import os from 'os'
import fs from 'fs'
import AdmZip from 'adm-zip'
import console from 'console'
import { ethers } from 'ethers'
import { SupportedAlgorithm } from 'ethers/lib/utils'
import { config } from './Config'
import apn from 'apn'
import { supabase } from './SupabaseClient'

export class Passes {
  /**
   * Triggers the generation of a pass file for a given platform (currently Apple or Google).
   * 
   * @return The file path to the pass.
   */
  static generatePass(
    platform: Platform,
    templateVersion: number,
    passportID: string,
    issueDateTimestamp: number,
    holderAddress: any,
    holderENSName: string,
    latestUpdateTitle: string,
    latestUpdateContent: string
  ): string {
    console.log('generatePass')

    console.log('platform:', platform)
    console.log('templateVersion:', templateVersion)
    console.log('passportID:', passportID)
    console.log('issueDateTimestamp:', issueDateTimestamp)
    console.log('holderAddress:', holderAddress)
    console.log('holderENSName:', holderENSName)
    console.log('latestUpdateTitle:', latestUpdateTitle)
    console.log('latestUpdateContent:', latestUpdateContent)

    if (platform == Platform.Apple) {
      // Create temporary directory for storing the pass files
      const tmpDirPrefix = path.join(os.tmpdir(), `passport_${holderAddress}_`)
      console.log('tmpDirPrefix:', tmpDirPrefix)
      const tmpDirPath: string = fs.mkdtempSync(tmpDirPrefix)
      console.log('tmpDirPath:', tmpDirPath)

      // Copy the template files to the temporary directory
      const templateVersionDir: string = path.join(
        process.cwd(),
        `template-versions/apple/${templateVersion}`
      )
      console.log('templateVersionDir:', templateVersionDir)
      const templateFiles: string[] = fs.readdirSync(templateVersionDir)
      console.log('templateFiles:', templateFiles)
      templateFiles.forEach((file) => {
        console.log('file:', file)
        const srcFilePath: string = path.join(templateVersionDir, file)
        console.log('srcFilePath', srcFilePath)
        const dstFilePath: string = path.join(tmpDirPath, file)
        console.log('dstFilePath', dstFilePath)
        fs.copyFileSync(srcFilePath, dstFilePath)
      })

      const passJsonFile: string = path.join(tmpDirPath, 'pass.json')
      console.log('passJsonFile:', passJsonFile)
      const passJson = JSON.parse(fs.readFileSync(passJsonFile, 'utf-8'))
      console.log('JSON.stringify(passJson):\n', JSON.stringify(passJson))

      // Set the passport holder (ENS name or ETH address)
      if (holderENSName != '') {
        passJson.storeCard.secondaryFields[0].value = holderENSName
        passJson.storeCard.backFields[3].value = holderENSName
      } else {
        const holderAddressShortform: string = `${holderAddress.substring(
          0,
          6
        )}...${holderAddress.substring(38, 42)}`
        passJson.storeCard.secondaryFields[0].value = holderAddressShortform
        passJson.storeCard.backFields[3].value = holderAddressShortform
      }

      // Set the passport number
      passJson.serialNumber = passportID
      passJson.storeCard.headerFields[0].value = passportID
      passJson.storeCard.backFields[2].value = passportID

      if ((platform == Platform.Apple) && (templateVersion >= 2)) {
        // Add a web service to update the pass
        // https://developer.apple.com/documentation/walletpasses/adding_a_web_service_to_update_passes

        // Set the web service URL
        passJson.webServiceURL = config.appleWebServiceUrl

        // Set the shared secret (authentication token) to be used with the web service
        const hmacAlgorithm : SupportedAlgorithm = SupportedAlgorithm['sha256']
        const hmacSeed : Uint8Array = ethers.utils.toUtf8Bytes(config.appleAuthTokenHmacSeed)
        const hmacData : Uint8Array = ethers.utils.toUtf8Bytes(passJson.serialNumber)
        const hmac : string = ethers.utils.computeHmac(hmacAlgorithm, hmacSeed, hmacData)
        passJson.authenticationToken = hmac

        if (templateVersion >= 3) {
          // Set "Latest Nation3 Update" (title and content)
          passJson.storeCard.backFields[5].value = latestUpdateTitle
          passJson.storeCard.backFields[6].value = latestUpdateContent
        }
      }

      // Set the passport type (e.g. "GENESIS")
      const passportNumber: number = Number(passportID)
      if (passportNumber < 420) {
        passJson.storeCard.secondaryFields[2].value = 'GENESIS'
      } else {
        passJson.storeCard.secondaryFields[2].value = 'REGULAR'
      }

      // Set the passport issue date
      const issueDateTimestampInMilliseconds: number = issueDateTimestamp * 1000
      const issueDateISOString: string = new Date(issueDateTimestampInMilliseconds)
        .toISOString()
        .substring(0, 10)
      console.log('issueDateISOString:', issueDateISOString)
      passJson.storeCard.secondaryFields[1].value = issueDateISOString
      passJson.storeCard.backFields[1].value = issueDateISOString

      console.log(
        'JSON.stringify(passJson) (after field population):\n',
        JSON.stringify(passJson)
      )

      // Write the changes to an updated pass.json file
      fs.writeFileSync(passJsonFile, JSON.stringify(passJson), { flag: 'w' })

      // Using the updated pass.json file, generate a manifest object of all the files in the template directory
      const manifestObject: JSON =
        AppleCryptoUtils.generateManifestObject(tmpDirPath)
      console.log('manifestObject:\n', manifestObject)

      // Stringify manifest object before storing in JSON file
      const manifestObjectStringified: string = JSON.stringify(manifestObject)
      console.log('manifestObjectStringified:', manifestObjectStringified)

      // Write the manifest object to a new file called manifest.json
      const manifestFile: string = path.join(tmpDirPath, 'manifest.json')
      fs.writeFileSync(manifestFile, manifestObjectStringified)

      // Create a PKCS#7 detached signature for the manifest that uses the private key of the
      // pass identifier signing certificate.
      const signatureBuffer: Buffer = AppleCryptoUtils.createSignature(
        manifestObjectStringified
      )

      // Add the signature to the top level of the pass bundle in a file called signature
      fs.writeFileSync(path.join(tmpDirPath, 'signature'), signatureBuffer)

      // Zip the resulting directory
      const zip = new AdmZip()
      const bundleFiles: string[] = fs.readdirSync(tmpDirPath)
      console.log('bundleFiles:', bundleFiles)
      bundleFiles.forEach((file) => {
        console.log('file:', file)
        const filePath: string = path.join(tmpDirPath, file)
        console.log('filePath', filePath)
        zip.addLocalFile(filePath)
      })
      const zipFile: string = path.join(
        tmpDirPath,
        `passport_${holderAddress}.zip`
      )
      console.log('zipFile:', zipFile)
      zip.writeZip(zipFile)

      // Change the file extension of the resulting archive from .zip to .pkpass
      const pkPassFile: string = zipFile.replace('.zip', '.pkpass')
      console.log('pkPassFile:', pkPassFile)
      fs.renameSync(zipFile, pkPassFile)

      return pkPassFile
    } else if (platform == Platform.Google) {
      // Load the Android pass template
      const templateVersion: number = 1
      // TODO

      return ''
    }
    return ''
  }

  /**
   * Pushes a notification to all the passes, notiyfing them of an update.
   * 
   * Note:  It is assumed that a new update was added to the `last_updates` table 
   * before calling this function.
   * 
   * @platform platform The platform where the notification will be sent
   * @returns Promise
   */
  static async notifyPassesAboutLastUpdate(platform: Platform): Promise<string> {
    console.log('notifyPassesAboutLastUpdate')
    
    return new Promise<string>((resolve, reject) => {
      if (platform == Platform.Apple) {
        // Lookup the push tokens of registered passes
        supabase
            .from('distinct_push_token')
            .select()
            .then((result: any) => {
              console.log('supabase then result\n', result)
              if (result.error) {
                reject(result.error.message)
              } else {
                result.data.map((pushTokenObject: any) => {
                  const pushToken: string = pushTokenObject['push_token']
                  console.log('pushToken:', pushToken)
                  
                  // Send notification request to Apple Push Notification service (APNs)
                  const apnProvider: apn.Provider = new apn.Provider({
                    cert: `-----BEGIN CERTIFICATE-----\n${config.appleCertificatePEM}\n-----END CERTIFICATE-----`,
                    key: `-----BEGIN RSA PRIVATE KEY-----\n${config.appleCertificateKey}\n-----END RSA PRIVATE KEY-----`,
                    production: true
                  })
                  const notification: apn.Notification = new apn.Notification();
                  notification.topic = 'pass.org.passport.nation3'
                  console.log('Sending notification...')
                  apnProvider.send(notification, pushToken)
                      .then((apn_result) => {
                        console.log('apnProvider then result:\n', apn_result)
                        if (apn_result.failed.length > 0) {
                          console.error('apn_result.failed:\n', apn_result.failed)
                        } else {
                          console.log('Notification sent!')
                        }
                      })
                })
                resolve('Sent notification request for ' + result.data.length + ' registered passes')
              }
            })
      } else if (platform == Platform.Google) {
        // TODO
        throw new Error('Platform not yet implemented: ' + platform)
      }
    })
  }
}
