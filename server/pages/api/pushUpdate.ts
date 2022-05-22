import { NextApiRequest, NextApiResponse } from "next"

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('/api/pushUpdate')
    
    // TODO

    res.status(200).json({ text: '// TODO' })
}
