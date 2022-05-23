import { NextApiRequest, NextApiResponse } from "next"
import basicAuthCheck from "../../utils/basicAuthCheck"

async function performBasicAuth(req: NextApiRequest, res: NextApiResponse) {
    console.log('performBasicAuth')
    await basicAuthCheck(req, res)
    return res
}

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('/api/pushNotification')

    performBasicAuth(req, res)
        .then(response => {
            console.log('then')
            console.log('response.statusCode', response.statusCode)
            if (response.statusCode != 200) {
                console.error(`Basic Auth failed: ${response.statusCode} ${response.statusMessage}`)
                res.status(response.statusCode).json({ statusCode: response.statusCode, message: response.statusMessage })
            } else {
                // Push notification to all the passes
                console.log('Pushing notification...')

                const title = 'title...' // TODO
                const content = 'content...' // TODO

                res.status(response.statusCode).json({ text: '// TODO' })
            }
        })
}
