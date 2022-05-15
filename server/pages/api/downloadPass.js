import { ApplePass } from "../../interfaces";

// req = HTTP incoming message, res = HTTP server response
export default function handler(req, res) {
    console.log('/api/downloadPass')
    
    const address = "0xabc..."; // TODO

    const signature = "0xdef..."; // TODO

    // Check that the address has a passport NFT
    // TODO

    // Check that the signature is valid
    // TODO

    // Populate the pass template
    // TODO

    // Serve the pass download to the user
    // TODO
    res.status(200).json({ text: '// TODO: passport.pass' });
}
