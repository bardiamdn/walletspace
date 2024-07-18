import { User } from "../db/entities/User";
import { JWTVerification } from "../lib/utils";

// Extend the Express Request interface to include an optional jwt property of type JWTVerification
// and declare it globally
declare global {
  namespace Express {
    interface Request {
      jwt?: JWTVerification;
      spaceInfo?: Space;
      user: User;
    }
  }
}