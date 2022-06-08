import { NextApiRequest, NextApiResponse } from "next"
import { ApplePass } from "../../interfaces"
const Web3 = require('web3')

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('/api/downloadPass2')
    
    console.log('require(\'os\').tmpdir():', require('os').tmpdir())
    res.status(200).json({ tmpdir: require('os').tmpdir() })
}
