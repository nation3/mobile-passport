import { NextApiRequest, NextApiResponse } from "next"
import { ApplePass } from "../../interfaces"

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('/api/downloadPass')
    
    const { address } = req.query
    console.log(`address: "${address}"`)

    // Check that the address is valid
    // TODO

    // Check that the address has a passport NFT
    // TODO

    const { signature } = req.query
    console.log(`signature: "${signature}"`)

    // Check that the signature is valid
    // TODO

    const { platform } = req.query
    console.log(`platform: "${platform}"`)

    // Check that the platform is valid
    // TODO

    // Populate the pass template
    // TODO

    // Serve the pass download to the user
    // TODO
    res.status(200).json({ text: '// TODO: passport.pass' })
}
