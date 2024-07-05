import express from 'express';

import { AppDataSource } from './db/dataSource';

import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoute';
import authMiddleware from './middlewares/authMiddleware';

AppDataSource
  .initialize()
  .then(() => {
    console.log("connected to the database")
  })
  .catch((err: any) => {
    console.error(err)
  })

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/api', authMiddleware);

app.use('/api/profile', profileRoutes);


app.listen(3000, () => console.log("server running on port 3000"))

export { app }