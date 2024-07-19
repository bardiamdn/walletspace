import * as crypto from 'crypto';
import * as jsonwebtoken from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

import { User } from '../db/entities/User';
import { JWTVerification } from '../types/jwt';

dotenv.config()

const privKeyPath = path.join('./libs/keys/', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(privKeyPath, 'utf8');


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

  const expiresIn= process.env.TOKEN_EXPIRATION as string;

  const payload: JWTVerification = {
    email: email,
    sub: id,            // Subject
    iat: Math.floor(Date.now() / 1000)     // Issued at
  };

  const signedToken: string = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256'});

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  };
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
  isValidEmail,
  sendConfirmationEmail
};