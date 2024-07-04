import express from 'express';

import { AppDataSource } from './db/dataSource';

import authRouter from './routes/auth';

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

app.use('/auth', authRouter);


// app.listen(3000, () => console.log("server running on port 3000"))

export { app }