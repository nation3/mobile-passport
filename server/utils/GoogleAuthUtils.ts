const { GoogleAuth } = require('google-auth-library')
const jwt = require('jsonwebtoken')

export class GoogleAuthUtils {

    static retrieveCredentials() {
        console.log('retrieveCredentials')

        // Path to service account key file obtained from Google CLoud Console.
        const serviceAccountFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || '/path/to/key.json'

        // Issuer ID obtained from Google Pay Business Console.
        const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || '<issuer ID>'

        // Developer defined ID for the wallet class.
        const classId = process.env.GOOGLE_WALLET_CLASS_ID || 'test-generic-class-id'

        // Developer defined ID for the user, eg an email address.
        const userId = process.env.GOOGLE_WALLET_USER_ID || 'test@example.com'

        // ID for the wallet object, must be in the form `issuerId.userId` where userId is alphanumeric.
        const objectId = `${issuerId}.${userId.replace(/[^\w.-]/g, '_')}-${classId}`

        const credentials = require(serviceAccountFile)

        return credentials
    }   
}
