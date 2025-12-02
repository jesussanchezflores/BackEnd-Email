// app/middleware.ts
// CORS middleware for Next.js (App Router)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const origin = request.headers.get('origin') ?? '*';
    const response = NextResponse.next();

    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
    response.headers.set('Access-Control-Max-Age', '86400'); // 1 day cache for preflight

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: response.headers,
        });
    }

    return response;
}

export const config = {
    matcher: '/api/:path*', // apply only to API routes
};
