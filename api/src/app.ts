import express from 'express';

import testRout from './tests/testRoutes';
import AppDataSource from './db/dataSource';

AppDataSource
  .initialize()
  .then(() => {
    console.log("connected to the database")
  })
  .catch(err => {
    console.error(err)
  })

const app = express();

app.use(express.json());
app.use("/test", testRout);

app.listen(3000, () => console.log("server running on port 3000"))
