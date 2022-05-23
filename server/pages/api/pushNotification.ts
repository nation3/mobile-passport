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

                const { title } = req.query
                console.log(`title: "${title}"`)
                if (!title || (String(title).trim().length == 0)) {
                    res.status(400).json({ error: 'Missing/empty parameter: title' })
                    return
                }

                const { content } = req.query
                console.log(`content: "${content}"`)
                if (!content || (String(content).trim().length == 0)) {
                    res.status(400).json({ error: 'Missing/empty parameter: content' })
                    return
                }

                // Remove leading/trailing whitespace
                const trimmedTitle = String(title).trim()
                const trimmedContent = String(content).trim()

                // Push notification
                // TODO

                res.status(response.statusCode).json({ text: '// TODO' })
            }
        })
}
