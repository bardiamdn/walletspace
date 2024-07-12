import { app, initializeApp } from ".";
import { AppDataSource } from "./dataSourceTestLite";

beforeAll(async () => {
  await initializeApp();
});

afterAll(async () => {
  await AppDataSource.destroy();
  // await AppDataSourceTest.dropDatabase();
});