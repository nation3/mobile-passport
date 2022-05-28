import type { NextFetchEvent, NextRequest } from 'next/server'

export function middleware(req: NextRequest, event: NextFetchEvent) {
    console.log('middleware')

    const pageName = req.page.name
    console.log('pageName:', pageName)

    return new Response(`pageName: "${pageName}"`)

    // if (pageName && pageName.startsWith('/api/push')) {
    //     const authorizationHeader = req.headers.get('authorization')
    //     console.log('authorizationHeader:', authorizationHeader)

    //     let wrongCredentials : boolean = false
    //     if (authorizationHeader) {
    //         // Get header value from "Basic <value>"
    //         const headerValueBase64 = authorizationHeader.split(' ')[1]

    //         // Decode from Base64
    //         const headerValue = Buffer.from(headerValueBase64, 'base64').toString()

    //         // Extract values from "<username>:<password>"
    //         const [username, password] = headerValue.split(':')
            
    //         // Get environment variables
    //         const basicAuthUsername = String(process.env.BASIC_AUTH_USERNAME)
    //         const basicAuthPassword = String(process.env.BASIC_AUTH_PASSWORD)

    //         // Compare credentials
    //         if ((username !== basicAuthUsername) || (password !== basicAuthPassword)) {
    //             wrongCredentials = true
    //         }
    //     }
    //     console.log('wrongCredentials:', wrongCredentials)

    //     if (!authorizationHeader || wrongCredentials) {
    //         // Perform Basic Auth
    //         return new Response('401 Unauthorized', {
    //             status: 401,
    //             headers: {
    //                 'WWW-Authenticate': 'Basic realm="Secure Area"',
    //             },
    //         })
    //     }
    // }
}
