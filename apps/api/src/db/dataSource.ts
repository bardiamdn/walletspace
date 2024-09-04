import 'reflect-metadata'
import dotenv from 'dotenv'
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Profile } from './entities/Profile';
import { Account } from './entities/Account';
import { Category } from './entities/Category';
import { Transaction } from './entities/Transaction';
import { Space } from './entities/Space';
import { Invitation } from './entities/Invitation';
import { Comment } from './entities/Comment';
import { Scan } from './entities/Scan';

dotenv.config()

export const AppDataSource = new DataSource({
  "type": "postgres",
  "host": process.env.DB_HOST,
  "port": 5432,
  "username": "postgres",
  "password": "myPassword",
  "database": "wallet_space",
  "logging": false,
  "synchronize": true,
  "entities": [User, Profile, Account, Category, Transaction, Space, Invitation, Comment, Scan]
})
