import { DataSource } from "typeorm";
import { User } from '../db/entities/User';
import { Profile } from '../db/entities/Profile';
import { Account } from '../db/entities/Account';
import { Category } from '../db/entities/Category';
import { Transaction } from '../db/entities/Transaction';
import { Space } from '../db/entities/Space';
import { Comment } from '../db/entities/Comment';


export const AppDataSourceTest = new DataSource({
  type: 'sqlite',
  database: ":memory:",
  dropSchema: true,
  entities: [User, Profile, Account, Category, Transaction, Space, Comment],
  synchronize: true,
  logging: false,
});