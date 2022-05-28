import { Platform } from "../interfaces"
import { GoogleAuthUtils } from "./GoogleAuthUtils"

export class Passes {

    /**
     * Triggers a download of a pass for a given passport ID and platform (currently Apple or Google).
     */
    static downloadPass(passportID: number, platform: Platform) {
        console.log('downloadPass')
        
        console.log('passportID:', passportID)
        console.log('platform:', platform)

        if (platform == Platform.Google) {
            console.log('platform == Platform.Google')
            GoogleAuthUtils.createPassAndToken()
        } else if (platform == Platform.Apple) {
            console.log('platform == Platform.Apple')
            // TODO
        }
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
