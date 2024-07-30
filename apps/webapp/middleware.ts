import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPaths = ['/account/register', '/account/signin'];

  const isAuthenticated = await checkUserAuthentication(req);
	
  if (publicPaths.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }
	
  if (!publicPaths.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/account/signin', req.url));
  }

  return NextResponse.next();
}


async function checkUserAuthentication(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('authToken');
	
  if (!token) {
		return false;
  }
	
  try {
    const res = await fetch('http://localhost:3000/auth/validate', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.value,
      },
      credentials: 'include',
    });

    if (!res.ok) {
			console.warn('Invalid token or failed request:', res.statusText);
      return false;
    }

		return res.status === 200;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
