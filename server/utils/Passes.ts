import { Platform } from "../interfaces"
import { AppleCryptoUtils } from "./AppleCryptoUtils"
import path from 'path'
import os from 'os'
import fs from 'fs'

export class Passes {

    /**
     * Triggers a download of a pass for a given passport ID and platform (currently Apple or Google).
     */
    static downloadPass(platform: Platform, passportID: number, holderAddress : any) : string {
        console.log('downloadPass')
        
        console.log('platform:', platform)
        console.log('passportID:', passportID)
        console.log('holderAddress:', holderAddress)

        if (platform == Platform.Apple) {
            // Create temporary directory for storing the pass files
            const tmpDirPrefix = path.join(os.tmpdir(), `passport_${holderAddress}_`)
            console.log('tmpDirPrefix:', tmpDirPrefix)
            const tmpDirPath : string = fs.mkdtempSync(tmpDirPrefix)
            console.log('tmpDirPath:', tmpDirPath)

            // Copy the template files to the temporary directory
            const templateVersion : number = 1
            const templateVersionDir : string = path.join(process.cwd(), `template-versions/apple/${templateVersion}`)
            console.log('templateVersionDir:', templateVersionDir)
            const templateFiles : string[] = fs.readdirSync(templateVersionDir)
            console.log('templateFiles:', templateFiles)
            templateFiles.forEach(file => {
                console.log('file:', file)
                const srcFilePath : string = path.join(templateVersionDir, file)
                console.log('srcFilePath', srcFilePath)
                const dstFilePath : string = path.join(tmpDirPath, file)
                console.log('dstFilePath', dstFilePath)
                fs.copyFileSync(srcFilePath, dstFilePath)
            })

            const passJsonFile : string = path.join(tmpDirPath, 'pass.json')
            console.log('passJsonFile:', passJsonFile)
            const passJson = JSON.parse(fs.readFileSync(passJsonFile, 'utf-8'))
            console.log('JSON.stringify(passJson):\n', JSON.stringify(passJson))

            // Set the holder name (ENS name or ETH address)
            passJson.storeCard.secondaryFields[0].value = holderAddress

            // Set the passport issue date
            // TODO

            // Set the passport number
            passJson.storeCard.headerFields[0].value = passportID

            // Set the passport type (e.g. "GENESIS")
            // TODO

            console.log('JSON.stringify(passJson) (after field population):\n', JSON.stringify(passJson))

            // Write the changes to an updated pass.json file
            fs.writeFileSync(passJsonFile, JSON.stringify(passJson), { flag : 'w' })

            // Using the updated pass.json file, generate a manifest object of all the files in the template directory
            const manifestObject : JSON = AppleCryptoUtils.generateManifestObject(tmpDirPath)
            console.log('manifestObject:\n', manifestObject)

            


            return JSON.stringify(passJson)
        } else if (platform == Platform.Google) {
            // Load the Android pass template
            const templateVersion : number = 1
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
