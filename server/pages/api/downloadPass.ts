import { NextApiRequest, NextApiResponse } from "next"
import { ApplePass } from "../../interfaces"
var Web3 = require('web3')

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('/api/downloadPass')
    
    const { address } = req.query
    console.log(`address: "${address}"`)

    // Check that the address is valid
    var web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
    if (!web3.utils.isAddress(address)) {
        res.status(400).json({ 
            error: 'Invalid address'
        })
        return
    }

    const { signature } = req.query
    console.log(`signature: "${signature}"`)

    // Check that the signature is valid
    // TODO

    const { platform } = req.query
    console.log(`platform: "${platform}"`)

    // Check that the platform is valid
    // TODO

    // Check that the address has a passport NFT
    // TODO

    // Lookup ENS name
    // TODO

    // Populate the pass template
    // TODO

    // Serve the pass download to the user
    // TODO
    res.status(200).json({ text: '// TODO: passport.pass' })
}
