import { NextApiRequest, NextApiResponse } from "next"
import { ApplePass, Platform } from "../../interfaces"
import { Passes } from "../../utils/Passes"
import os from 'os'
const Web3 = require('web3')

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('/api/downloadPass')
    
    const { address } = req.query
    console.log(`address: "${address}"`)

    // Check that the address is valid
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
    if (!web3.utils.isAddress(address)) {
        console.error('Invalid address')
        res.status(400).json({ 
            error: 'Invalid address'
        })
        return
    }

    const { signature } = req.query
    console.log(`signature: "${signature}"`)

    // Check that the signature is valid
    const signedMessage = 'I am the holder of this Nation3 passport'
    let recoveredAddress = undefined
    try {
        recoveredAddress = web3.eth.accounts.recover(signedMessage, signature);
    } catch (error: any) {
        console.error('Invalid signature\n', error)
        res.status(400).json({ 
            error: 'Invalid signature'
        })
        return
    }
    console.log(`recoveredAddress: "${recoveredAddress}"`)
    if (address != recoveredAddress) {
        console.error('Invalid signature (address not recovered)')
        res.status(400).json({ 
            error: 'Invalid signature (address not recovered)'
        })
        return
    }

    const { platform } = req.query
    console.log(`platform: "${platform}"`)

    // Check that the platform is valid
    // TODO

    // Check that the address has a passport NFT
    // TODO

    // Lookup ENS name
    // TODO

    // Populate the pass template
    Passes.downloadPass(Platform.Apple, 123456, address)

    // Serve the pass download to the user
    // TODO
    // res.status(200).json({ text: '// TODO: passport.pass' })

    console.log('os.tmpdir():', os.tmpdir())
    res.status(200).json({ tmpdir: os.tmpdir() })
}
