import 'reflect-metadata'
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Profile } from './entities/Profile';
import { Account } from './entities/Account';
import { Category } from './entities/Category';
import { Transaction } from './entities/Transaction';
import { Space } from './entities/Space';
import { Comment } from './entities/Comment';

const AppDataSource = new DataSource({
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "myPassword",
  "database": "wallet_space",
  "logging": true,
  "synchronize": true,
  "entities": [User, Profile, Account, Category, Transaction, Space, Comment]
  // "entities": ["dist/db/entities/*.js"]   // for npm run build
  // "entities": ["src/db/entities/*.ts"]      // for npm run dev
})

export default AppDataSource