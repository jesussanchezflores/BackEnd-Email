// app/middleware.ts
// CORS middleware for Next.js (App Router)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista blanca de orígenes permitidos
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
    const response = NextResponse.next();

    // Si el origen está permitido, lo devolvemos, si no, usamos '*'
    response.headers.set('Access-Control-Allow-Origin', isAllowed ? origin : '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
    response.headers.set('Access-Control-Max-Age', '86400'); // 1 day cache for preflight

    // Manejar preflight OPTIONS
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
