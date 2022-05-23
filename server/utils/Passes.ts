export class Passes {

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
