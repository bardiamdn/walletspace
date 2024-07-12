import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';

const publicKeyPath = path.join(__dirname, '../utils/', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(publicKeyPath, 'utf8');

// Middleware for JWT authentication
export default function authMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
  const token = req.headers.authorization;

  try {
    if (token) {
      const tokenParts = token.split(' ');
      if (tokenParts[0] === 'Bearer' && tokenParts[1]?.match(/\S+\.\S+\.\S+/)) {
        try {
          // Decrypt and verify the token
          const verification = verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] }) as JwtPayload;

          if (!verification.exp || !verification.iat || !verification.sub) {
            return res.status(401).json({ success: false, message: "Unauthorized: Missing 'exp' or 'iat' in token" });
          }
          
          const timeToExp = verification.exp - (Date.now() / 1000)
          // Check expiration date
          if (timeToExp > 0) {
            // Exclude email
            const { email, ...authInfo } = verification

            req.jwt = authInfo;
            next();
          } else {
            res.status(401).json({ success: false, message: "You are not authorized to visit this route" })
          }
          
        } catch (err) {
          res.status(401).json({ success: false, message: "You are not authorized to visit this route" });
        }
      } else {
        res.status(401).json({ success: false, message: "You are not authorized to visit this route" });
      }
    } else {
      res.status(401).json({ success: false, message: "Authorization header not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}