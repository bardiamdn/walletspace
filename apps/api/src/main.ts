import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

import { AppDataSource } from './db/dataSource';

import authRoutes from './routes/auth.route';
import profileRoute from './routes/profile.route';
import accountRoutes from './routes/account.route';
import categoryRoutes from './routes/category.route';
import transactionRoutes from './routes/transaction.route';
import spaceRoutes from './routes/space.route';
import invitationRoute from './routes/invitation.route';
import commentRoutes from './routes/comment.route'
import scannerRoute from './routes/scanner.route'

dotenv.config()


AppDataSource
  .initialize()
  .then(() => {
    console.log("connected to the database")
  })
  .catch((err: any) => {
    console.error(err)
  })

const app = express();

app.use(cors({
  origin: '*', // Adjust later for production
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true,
  allowedHeaders: 'Authorization, Content-Type',
}));

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/', profileRoute);
app.use('/', accountRoutes);
app.use('/', categoryRoutes);
app.use('/', transactionRoutes);
app.use('/', spaceRoutes);
app.use('/', invitationRoute);
app.use('/', commentRoutes);
app.use('/', scannerRoute)


app.listen(process.env.PORT || 3000, () => console.log(`server running on port ${process.env.PORT}`))

export { app }