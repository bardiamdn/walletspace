import { app, initializeApp } from ".";
import { AppDataSourceTest } from "./dataSourceTestLite";

beforeAll(async () => {
  await initializeApp();
});

afterAll(async () => {
  await AppDataSourceTest.destroy();
  // await AppDataSourceTest.dropDatabase();
});