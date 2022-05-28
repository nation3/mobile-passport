const { GoogleAuth } = require('google-auth-library')
const jwt = require('jsonwebtoken')

export class GoogleAuthUtils {

    static async createPassAndToken() {
        console.log('createPassAndToken')

        // Issuer ID obtained from Google Pay Business Console.
        const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || '<issuer ID>'

        // Developer defined ID for the wallet class.
        const classId = process.env.GOOGLE_WALLET_CLASS_ID || 'test-generic-class-id'

        // Developer defined ID for the user, eg an email address.
        const userId = process.env.GOOGLE_WALLET_USER_ID || 'test@example.com'

        // ID for the wallet object, must be in the form `issuerId.userId` where userId is alphanumeric.
        const objectId = `${issuerId}.${userId.replace(/[^\w.-]/g, '_')}-${classId}`

        // The content of the service account key file obtained from Google Cloud Console.
        const serviceAccountCredentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS || 'Base64 encoded'
        console.log('serviceAccountCredentialsBase64:\n', serviceAccountCredentialsBase64)

        // Decode from Base64
        const serviceAccountCredentials = Buffer.from(serviceAccountCredentialsBase64, "base64").toString()
        console.log('serviceAccountCredentials:\n', serviceAccountCredentials)

        // Convert service account credentials from string to JSON
        // const serviceAccountCredentialsJSON = JSON.parse(serviceAccountCredentials)
        const serviceAccountCredentialsFromFile = require('../key.json')
        const serviceAccountCredentialsJSON = JSON.parse(serviceAccountCredentialsFromFile)
        console.log('serviceAccountCredentialsJSON:\n', serviceAccountCredentialsJSON)
        
        const httpClient = new GoogleAuth({
            credentials: serviceAccountCredentialsJSON,
            scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
        })

        const objectPayload = require('../../template-versions/google/1/generic-pass.json')
        objectPayload.id = objectId
        objectPayload.classId = classId
        console.log('objectPayload:\n', objectPayload)

        // Create a pass object
        const objectUrl = 'https://walletobjects.googleapis.com/walletobjects/v1/genericObject/'
        let objectResponse;
        try {
            objectResponse = await httpClient.request({url: objectUrl + objectPayload.id, method: 'GET'});
            console.log('existing object', objectPayload.id);
        } catch (err : any) {
            if (err.response && (err.response.status === 404)) {
                objectResponse = await httpClient.request({url: objectUrl, method: 'POST', data: objectPayload});
                console.log('new object', objectPayload.id);
            } else {
                console.error(err);
                throw err;
            }
        }
    }
}
