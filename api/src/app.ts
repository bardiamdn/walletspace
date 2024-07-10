import express from 'express';

import { AppDataSource } from './db/dataSource';

import authRoutes from './routes/authRoutes';
import profileRoute from './routes/profileRoute';
import accountRoutes from './routes/accountRoutes';
import categoryRoutes from './routes/categoryRoutes';
import transactionRoutes from './routes/transactionRoutes';
import spaceRoutes from './routes/spaceRoutes';
import invitationRoute from './routes/invitationRoutes';
import commentRoutes from './routes/commentRoute'


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

app.use('/', profileRoute);
app.use('/', accountRoutes);
app.use('/', categoryRoutes);
app.use('/', transactionRoutes);
app.use('/', spaceRoutes);
app.use('/', invitationRoute);
app.use('/', commentRoutes);


app.listen(3000, () => console.log("server running on port 3000"))

export { app }