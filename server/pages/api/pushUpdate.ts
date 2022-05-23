import { NextApiRequest, NextApiResponse } from "next"
import basicAuthCheck from "../../utils/basicAuthCheck"
import { Passes } from "../../utils/Passes"

async function performBasicAuth(req: NextApiRequest, res: NextApiResponse) {
    console.log('performBasicAuth')
    await basicAuthCheck(req, res)
    return res
}

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('/api/pushUpdate')

    performBasicAuth(req, res)
        .then(response => {
            console.log('then')
            console.log('response.statusCode', response.statusCode)
            if (response.statusCode != 200) {
                console.error(`Basic Auth failed: ${response.statusCode} ${response.statusMessage}`)
                res.status(response.statusCode).json({ statusCode: response.statusCode, message: response.statusMessage })
            } else {
                // Push update of new template
                console.log('Pushing template update...')
                
                const templateFormatVersion: number = 1
                const updateSent: boolean = Passes.pushUpdate(templateFormatVersion)

                res.status(response.statusCode).json({ updateSent: updateSent, templateFormatVersion: templateFormatVersion })
            }
        })
}
