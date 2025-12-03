// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
    'https://comunidaddigital.net',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
];

export function middleware(request: NextRequest) {
    const origin = request.headers.get('origin') ?? '';
    const isAllowed = allowedOrigins.includes(origin);

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 200 });

        if (isAllowed) {
            response.headers.set('Access-Control-Allow-Origin', origin);
            response.headers.set('Access-Control-Allow-Credentials', 'true');
        } else {
            // For debugging/development, maybe allow * if origin is missing (e.g. tools)? 
            // But for browser, we need strict origin if credentials are used.
            // If origin is not in whitelist, we don't set ACAO, so browser blocks it.
        }

        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
        response.headers.set('Access-Control-Max-Age', '86400');

        return response;
    }

    // Handle actual request
    const response = NextResponse.next();

    if (isAllowed) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
}

export const config = {
    matcher: '/api/:path*',
};
