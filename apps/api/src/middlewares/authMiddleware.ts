import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';

import { AppDataSource } from '../db/dataSource';
import { User } from '../db/entities/User';

const publicKeyPath = path.join('./secrets/development/keys/', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(publicKeyPath, 'utf8');

// Middleware for JWT authentication
export default async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const token = req.headers.authorization;
  let tokenParts: string[]
  if (token) {
    tokenParts = token.split(' ');

    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]?.match(/\S+\.\S+\.\S+/)) {
      return res.status(401).json({ success: false, message: "You are not authorized to visit this route" });
    }
  } else {
    return res.status(401).json({ success: false, message: "Authorization header not found" });
  }
  try {
    // Decrypt and verify the token
    const verification = verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] }) as JwtPayload;

    if (!verification.exp || !verification.iat || !verification.sub) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing 'exp' or 'iat' in token" });
    }

    const timeToExp = verification.exp - Math.floor(Date.now() / 1000)
    const user = await AppDataSource.manager.findOneBy(User, { user_id: parseInt(verification.sub) }) as User;
    // Check expiration date
    if (timeToExp > 0) {
      // Exclude email
      const { email, ...authInfo } = verification
      req.jwt = authInfo;
      req.user = user;
      return next();
    } else {
      return res.status(401).json({ success: false, message: "You are not authorized to visit this route" })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}