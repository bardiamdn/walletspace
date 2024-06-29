import express, { Request, Response } from 'express';
import path from 'path';
import bcrypt from 'bcrypt';

import { User } from '../db/entities/User';
import { Profile } from '../db/entities/Profile';
import { Account } from '../db/entities/Account';
import { Category } from '../db/entities/Category';
import { Transaction } from '../db/entities/Transaction';
import AppDataSource from '../db/dataSource';

const router = express.Router();

// Serve the static HTML file
router.get('/', async (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, '..', '..', 'src', 'testfile.html');
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).send('Error sending file');
  } 
});
// Handle data insertion
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await AppDataSource.getRepository(User).findOneBy({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = AppDataSource.getRepository(User).create({
      email: email,
      password_hash: passwordHash,
      password_salt: salt
    });

    const result = await AppDataSource.getRepository(User).save(newUser);

    return res.status(201).json({ message: 'User created successfully', result: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating user' });
  }
});


// get a specific user by their email
router.get('/:email', async (req: Request, res: Response) => {
  console.log(req.params.email)
  const user = await AppDataSource.getRepository(User).findOneBy({
    email: req.params.email
  });
  res.status(200).json(user);
});
// get all data
router.get('/users', async (req: Request, res: Response) => {
  // console.log(req.params.email)
  const result = await AppDataSource.getRepository(User).find();
  res.status(200).json(result);
});
router.get('/profiles', async (req: Request, res: Response) => {
  // console.log(req.params.email)
  const result = await AppDataSource.getRepository(Profile).find();
  res.status(200).json(result);
});
router.get('/accounts', async (req: Request, res: Response) => {
  // console.log(req.params.email)
  const result = await AppDataSource.getRepository(Account).find();
  res.status(200).json(result);
});
router.get('/categories', async (req: Request, res: Response) => {
  // console.log(req.params.email)
  const result = await AppDataSource.getRepository(Category).find();
  res.status(200).json(result);
});
router.get('/transactions', async (req: Request, res: Response) => {
  // console.log(req.params.email)
  const result = await AppDataSource.getRepository(Transaction).find();
  res.status(200).json(result);
});

export default router;
