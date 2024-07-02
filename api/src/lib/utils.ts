import * as crypto from 'crypto';
import * as jsonwebtoken from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import { User } from '../db/entities/User';
import { JWTVerification } from '../types/jwt';

const privKeyPath = path.join(__dirname, '../utils/', 'id_rsa_priv.pem');
const publicKeyPath = path.join(__dirname, '../utils/', 'id_rsa_pub.pem');
const PRIV_KEY = fs.readFileSync(privKeyPath, 'utf8');
const PUB_KEY = fs.readFileSync(publicKeyPath, 'utf8');


function validPassword(password: string, hash: string, salt: string): boolean {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  
  return hash === hashVerify;
}

function genPassword(password: string): { salt: string, hash: string} {
  const salt = crypto.randomBytes(32).toString('hex');
  const genhash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  
  return { salt, hash: genhash };
}

// Issue a JWT for a user
function issueJWT(user: User): { token: string, expires: string } {
  const id = user.user_id;
  const email = user.email;

  const expiresIn = '7d';

  const payload: JWTVerification = {
    email: email,
    sub: id,            // Subject
    iat: Date.now()     // Issued at
  };

  const signedToken: string = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256'});

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  };
}

// Middleware for JWT authentication
function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization;
  if (token) {
    const tokenParts = token.split(' ');
    if (tokenParts[0] === 'Bearer' && tokenParts[1]?.match(/\S+\.\S+\.\S+/)) {
      try {
        // Decrypt and verify the token
        const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] }) as JwtPayload;
        console.log(verification);
        req.jwt = verification;
        next();
      } catch (err) {
        res.status(401).json({ success: false, msg: "You are not authorized to visit this route" });
      }
    } else {
      res.status(401).json({ success: false, msg: "You are not authorized to visit this route" });
    }
  } else {
    res.status(401).json({ success: false, msg: "Authorization header not found" });
  }
}


// Check email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Confirm email
async function sendConfirmationEmail(to: string, token: string ): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailersend.net',
    port: 587,
    auth: {
      user: 'MS_qwdB6o@wallet-space.com',
      pass: process.env.EMAIL_PASS
    },
  });
  
  interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
  };

  const mailOptions: MailOptions = {
    from: 'MS_qwdB6o@wallet-space.com',
    to: to,
    subject: 'Confirm Your Email',
    html: `<p>Click <a href="http://localhost:3000/auth/confirm-email?token=${token}">here</a> to confirm your email address.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  };
};

export {
  validPassword,
  genPassword,
  issueJWT,
  authMiddleware,
  isValidEmail,
  sendConfirmationEmail
};