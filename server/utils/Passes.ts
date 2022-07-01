import { Platform } from '../interfaces'
import { AppleCryptoUtils } from './AppleCryptoUtils'
import path from 'path'
import os from 'os'
import fs from 'fs'
import AdmZip from 'adm-zip'
import console from 'console'

export class Passes {
  /**
   * Triggers a download of a pass for a given passport ID and platform (currently Apple or Google).
   */
  static downloadPass(
    platform: Platform,
    passportID: string,
    timestamp: number,
    holderAddress: any,
    holderENSName: string
  ): string {
    console.log('downloadPass')

    console.log('platform:', platform)
    console.log('passportID:', passportID)
    console.log('holderAddress:', holderAddress)
    console.log('holderENSName:', holderENSName)

    if (platform == Platform.Apple) {
      // Create temporary directory for storing the pass files
      const tmpDirPrefix = path.join(os.tmpdir(), `passport_${holderAddress}_`)
      console.log('tmpDirPrefix:', tmpDirPrefix)
      const tmpDirPath: string = fs.mkdtempSync(tmpDirPrefix)
      console.log('tmpDirPath:', tmpDirPath)

      // Copy the template files to the temporary directory
      const templateVersion: number = 1
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

      // Set the passport type (e.g. "GENESIS")
      const passportNumber: number = Number(passportID)
      if (passportNumber < 420) {
        passJson.storeCard.secondaryFields[2].value = 'GENESIS'
      } else {
        passJson.storeCard.secondaryFields[2].value = 'REGULAR'
      }

      // Set the passport issue date
      const timestampInMilliseconds: number = timestamp * 1000
      const timeISOString: string = new Date(timestampInMilliseconds)
        .toISOString()
        .substring(0, 10)
      console.log('timeISOString:', timeISOString)
      passJson.storeCard.secondaryFields[1].value = timeISOString
      passJson.storeCard.backFields[1].value = timeISOString

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
      console.log('signatureBuffer:', signatureBuffer)

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
   * Pushes an updated template to all the passes.
   */
  static pushUpdate(templateFormatVersion: number): boolean {
    console.log('pushUpdate')

    console.log('templateFormatVersion:', templateFormatVersion)

    // Lookup template file matching the templateFormatVersion
    // TODO

    // Get the list of registered passes
    // TODO

    // For each registered pass, push the template update
    // TODO

    return true
  }

  /**
   * Pushes a notification to all the passes
   */
  static pushNotification(title: string, content: string): boolean {
    console.log('pushNotification')

    console.log(`title: "${title}"`)
    console.log(`content: "${content}"`)

    // Get the list of registered passes
    // TODO

    // For each registered pass, push the notification
    // TODO

    return true
  }
}
