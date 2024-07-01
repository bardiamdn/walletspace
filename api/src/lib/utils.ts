import * as crypto from 'crypto';
import * as jsonwebtoken from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

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

export {
  validPassword,
  genPassword,
  issueJWT,
  authMiddleware
};