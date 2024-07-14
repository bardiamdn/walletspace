import { Router, Request, Response } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

import { User } from '../db/entities/User';
import { Profile } from '../db/entities/Profile';
import { AppDataSource } from '../db/dataSource';
// import { AppDataSource } from '../tests/dataSourceTestLite';
import * as utils from '../lib/utils';

dotenv.config();
const publicKeyPath = path.join('./libs/keys/', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(publicKeyPath, 'utf8');


const router = Router();

// Manual signup
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if(!utils.isValidEmail(email)) {
    return res.status(400).json({ succcess: false, message: "Please provide your email and password"});
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const profileRepo = AppDataSource.getRepository(Profile);

    const existingUser = await userRepo.findOne({ where: {email: email} })
    
    if (existingUser) {
      return res.status(400).json({ succcess: false, message: 'User already exists' });
    }

    const { salt, hash } = utils.genPassword(password);
    const newUser = userRepo.create({
      email,
      password_salt: salt,
      password_hash: hash,
      email_confirmed: false
    });

    await userRepo.save(newUser);

    const newProfile = profileRepo.create({
      username: email.split('@')[0],
      user: newUser
    });

    await profileRepo.save(newProfile);

    // Issue JWT token and send confirmation email
    let { token } = utils.issueJWT(newUser);
    utils.sendConfirmationEmail(email, token.split(' ')[1])
    
    console.log(`Sent confirmation email to ${email}`);
    
    return res.status(201).json({ success: true, message: 'Please confirm your email' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'An error occurred during user creation' });
  }
});

// Resend verification email
router.get('/resend-confirm', async (req: Request, res: Response) => {
  const { email } = req.query as { email: string};
  try {
    const user = await AppDataSource.getRepository(User).findOneBy({ email, email_confirmed: false });

    if (!user) {
      return res.status(404).send("<h3>Email doesn't exist or is already confirmed</h3>" );
    }
    const { token } = utils.issueJWT(user);
    await utils.sendConfirmationEmail(email, token.split(' ')[1]);

    return res.status(200).send(`
      <h3>Please Confirm Your Email</h3>
    `)
  } catch (err) {
    console.error(err);
    return res.status(500).send('<h3>Internal server error</h3>');
  }
});

// Confirm verification email
router.get('/confirm-email', async (req: Request, res: Response) => {
  const token = req.query.token as string;
  try {
    // Verify the token
    const userVerification = jsonwebtoken.verify(token, PUB_KEY, { algorithms: ['RS256'] }) as JwtPayload;
    
    if (userVerification.iat === undefined) {
      return res.status(400).send('<h3>Token missing iat field');
    }
    
    // Check the timeout
    const issuedAt = Math.floor(userVerification.iat);
    const currentTime = Math.floor(Date.now());
    if (currentTime - issuedAt > 300_000) { // 300 seconds
      return res.status(400).send(`
        <h3>Email Confirmation Failed!</h3>
        <p>Your token is expired. <a href="/auth/resend-confirm?email=${userVerification.email}">Resend</a> the verification email.</p>
      `)
    }

    // Check user email extracted from token
    const user = await AppDataSource.getRepository(User).findOne({ where: {email: userVerification.email, email_confirmed: false } });
    
    if (!user) {
      return res.status(404).send('<h3>User not found or email already confirmed</h3>');
    }

    user.email_confirmed = true;
    await AppDataSource.getRepository(User).save(user);
    console.log("Email confirmed");

    return res.status(200).send(`
      <h3>Email Confirmation Successful!</h3>
      <p>Your email has been confirmed. You can now <a href="/signin">sign in</a> to your account.</p>
    `)
  } catch (error) {
    console.error('Error confirming email:', error);
    return res.status(500).send('<h3>An error occurred</h3>');
  }
});

// Signin
router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await AppDataSource.getRepository(User).findOneBy({ email: email }) as User;

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if(!user.email_confirmed) {
      return res.status(401).json({ success: false, message: 'Please confirm your email' });
    }

    const validation = utils.validPassword(password, user.password_hash, user.password_salt);

    if (validation) {
      const authInfo = utils.issueJWT(user);
      return res.status(200).json({ success: true, authInfo: authInfo });
    } else {
      return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
  } catch (err) {
    console.error('Error during signin:', err);
    return res.status(500).json({ success: false, message: 'An error occurred during signin' });
  }
});

// Reset password
// Delete account
// Authenticated check

export default router;
