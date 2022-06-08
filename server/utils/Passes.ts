import { Platform } from "../interfaces"
import { AppleCryptoUtils } from "./AppleCryptoUtils"

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
            // Load the Apple pass template
            const templateVersion : number = 1
            const passJsonFile : string = `../../template-versions/apple/${templateVersion}/pass.json`
            console.log('passJsonFile:', passJsonFile)
            const passJson = require(`../../template-versions/apple/${templateVersion}/pass.json`)
            console.log('passJson:\n', passJson)

            // Set the holder name (ENS name or ETH address)
            passJson.storeCard.secondaryFields[0].value = holderAddress

            // Set the passport issue date
            // TODO

            // Set the passport number
            passJson.storeCard.headerFields[0].value = passportID

            // Set the passport type (e.g. "GENESIS")
            // TODO

            // Generate manifest object using the files in the template directory
            const manifestObject : JSON = AppleCryptoUtils.generateManifestObject(templateVersion)
            console.log('manifestObject:\n', manifestObject)

            


            return JSON.stringify(manifestObject)
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
