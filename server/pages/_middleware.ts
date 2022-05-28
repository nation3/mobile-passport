import type { NextFetchEvent, NextRequest } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    console.log('middleware')

    console.log('req.page.name:', req.page.name)

    const basicAuth = req.headers.get('authorization')
    console.log('basicAuth:', basicAuth)
  
    if (!basicAuth) {
        return new Response(
            '401 Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"',
            },
        })
    }
}
