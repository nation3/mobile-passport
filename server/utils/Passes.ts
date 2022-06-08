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
            try {
                // Create temporary directory for storing the pass files
                const tmpDirPrefix = path.join(os.tmpdir(), `passport_${holderAddress}_`)
                console.log('tmpDirPrefix:', tmpDirPrefix)
                const tmpDirPath : string = fs.mkdtempSync(tmpDirPrefix)
                console.log('tmpDirPath:', tmpDirPath)

                console.log('process.cwd():', process.cwd())
                console.log('path.basename(process.cwd()):', path.basename(process.cwd()))
                
                console.log('files in parent directory:')
                fs.readdir('../', (err, files) => {
                    if (err) {
                        console.error('err:\n', err)
                        throw err
                    }
                    console.log('files (parent):', files)
                })

                console.log('files in current directory:')
                fs.readdir('./', (err, files) => {
                    if (err) {
                        console.error('err:\n', err)
                        throw err
                    }
                    console.log('files (current):', files)
                })
                
                console.log('files in .next directory:')
                fs.readdir('.next', (err, files) => {
                    if (err) {
                        console.error('err:\n', err)
                        throw err
                    }
                    console.log('files (.next):', files)
                })

                console.log('files in ./public/template-versions directory:')
                fs.readdir('./public/template-versions', (err, files) => {
                    if (err) {
                        console.error('err:\n', err)
                        throw err
                    }
                    console.log('files (./public/template-versions):', files)
                })

                // Copy the template files to the temporary directory
                const templateVersion : number = 1
                const templateVersionDir : string = `./public/template-versions/apple/${templateVersion}`
                console.log('templateVersionDir:', templateVersionDir)
                // fs.readdir(templateVersionDir, (err, files) => {
                //     if (err) {
                //         console.error('err:\n', err)
                //         throw err
                //     }
                //     console.log('files:', files)
                // })
                // const templateFiles : string[] = fs.readdirSync(templateVersionDir)
                // console.log('templateFiles:', templateFiles)
                // templateFiles.forEach(file => {
                //     console.log('file:', file)
                //     const srcFilePath : string = path.join(templateVersionDir, file)
                //     console.log('srcFilePath', srcFilePath)
                //     const dstFilePath : string = path.join(tmpDirPath, file)
                //     console.log('dstFilePath', dstFilePath)
                //     // fs.copyFileSync(srcFilePath, dstFilePath)
                // })
            } catch (err: any) {
                console.error('err.message:', err.message)
                throw err
            }

            // const passJsonFile : string = path.join(tmpDirPath, 'pass.json')
            // console.log('passJsonFile:', passJsonFile)
            // const passJson = JSON.parse(fs.readFileSync(passJsonFile, 'utf-8'))
            // console.log('passJson:\n', passJson)

            // // Set the holder name (ENS name or ETH address)
            // passJson.storeCard.secondaryFields[0].value = holderAddress

            // // Set the passport issue date
            // // TODO

            // // Set the passport number
            // passJson.storeCard.headerFields[0].value = passportID

            // // Set the passport type (e.g. "GENESIS")
            // // TODO

            // // // Generate manifest object using the files in the template directory
            // // const manifestObject : JSON = AppleCryptoUtils.generateManifestObject(templateVersion)
            // // console.log('manifestObject:\n', manifestObject)

            


            // return JSON.stringify(passJson)
            return JSON.stringify({})
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
