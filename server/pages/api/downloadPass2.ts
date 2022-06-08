import { NextApiRequest, NextApiResponse } from "next"
import { ApplePass } from "../../interfaces"
const Web3 = require('web3')
import { writeFile } from 'fs'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('/api/downloadPass2')
    
    console.log('require(\'os\').tmpdir():', require('os').tmpdir())

    const data = new Uint8Array(Buffer.from('file data'));
    const filePath = require('os').tmpdir() + '/message.txt'
    console.log('filePath:', filePath)
    writeFile(require('os').tmpdir() + '/message.txt', data, (err) => {
        if (err) {
            throw err;
        }
        console.log('The file has been saved!', filePath);
    });

    res.status(200).json({ tmpdir: require('os').tmpdir(), filePath: filePath })
}
