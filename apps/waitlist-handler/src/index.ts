import crypto from 'node:crypto'
import { Buffer } from 'node:buffer'

export interface Env {
  WAITLIST_DB: D1Database
  WAITLIST_HANDLER_URL: string
  EMAIL_PASS: string
  TOKEN_EXPIRATION: string
  PRIV_KEY: string
  PUB_KEY: string
}

type Email = string
type Token = string

function handleCors(request: Request): Response {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "https://walletspace.pages.dev");
  headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(null, { status: 204, headers });
}

export async function generateToken(email: Email, env: Env): Promise<string> {
  const payload = {
    sub: email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  };

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const data = `${encodedHeader}.${encodedPayload}`;

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    Buffer.from(env.PRIV_KEY, "base64"),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(data)
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  console.log(`${data}.${encodedSignature}`);

  return `${data}.${encodedSignature}`;
}

async function validateTokenMW(token: Token, env: Env): Promise<Email | null> {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    console.error("Invalid token format: ", token)
    return null
  }

  const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  const payload = JSON.parse(payloadJson);

  console.log(payload)

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    console.error("Token has expired: ", payload)
    return null
  }

  const publicKey = await crypto.subtle.importKey(
    'spki',
    Buffer.from(env.PUB_KEY, 'base64'),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    true,
    ['verify']
  );

  const isValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    Buffer.from(encodedSignature, 'base64url'),
    Buffer.from(`${encodedHeader}.${encodedPayload}`),
  );

  if (!isValid) {
    console.error("Invalid token signature")
    return null
  }

  return payload.sub as Email;
}


async function sendConfirmationEmail(to: Email, token: Token, env: Env): Promise<void> {
  const mailBody = {
    from: 'MS_qwdB6o@wallet-space.com',
    to: [to],
    subject: 'Confirm Your Email',
    html: `<p>Click <a href="${env.WAITLIST_HANDLER_URL}/email/verify?token=${token}">here</a> to confirm your email address.</p>`
  };

  try {
    const response = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.EMAIL_PASS}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailBody),
    });

    if (!response.ok) {
      console.error('Failed to send email:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (request.method === "OPTIONS") {
      return handleCors(request);
    }

    try {
      // POST /waitlist
      if (request.method === "POST" && pathname === "/waitlist") {
        type RequestBody = { email: string }

        const body: RequestBody = await request.json();
        const email = body.email;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { results } = await env.WAITLIST_DB.prepare(
          "SELECT * FROM Waitlist WHERE email = ?",
        ).bind(email).all()
        if (!email || !emailRegex.test(email)) {
          return new Response("Invalid email address", {
            status: 400,
            headers: { 'Content-Type': 'text/plain' }
          });
        }

        if (results.length > 0) {
          // send confirmation even if email exists
          const token = await generateToken(email, env)
          await sendConfirmationEmail(email, token, env)

          return new Response("Email address already exists, confirmation email sent", {
            status: 409,
            headers: { 'Content-Type': 'text/plain' }
          });
        }

        await env.WAITLIST_DB.prepare(
          "INSERT INTO Waitlist (email, verified) VALUES (?, ?)"
        ).bind(email, false).run();

        // send confirmation after saved to DB
        const token = await generateToken(email, env)
        await sendConfirmationEmail(email, token, env)

        return new Response("Email added to waitlist", {
          status: 201,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      // GET /email/verify
      if (pathname === "/email/verify") {
        const url = new URL(request.url);
        const token = url.searchParams.get('token') as Token

        if (!token) {
          return new Response('Invalid token', { status: 400 });
        }

        const email = await validateTokenMW(token, env);

        if (!email) {
          return new Response("You are not authenticated", { status: 403 })
        }

        await env.WAITLIST_DB.prepare(
          "UPDATE Waitlist SET verified = ? WHERE email = ?"
        ).bind(true, email).run();

        return new Response('Email successfully verified', { status: 200 });
      }

    } catch (error) {
      console.error('Database error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
    return new Response('Hello, from WalletSpace waitlist handler');
  },
};
