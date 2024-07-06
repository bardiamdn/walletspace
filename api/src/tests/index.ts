import { AppDataSource } from "./dataSourceTestLite";
import { Profile } from "../db/entities/Profile";
import { User } from "../db/entities/User";
import express from "express";

const app = express();
app.use(express.json());

const initializeApp = async () => {
  await AppDataSource.initialize();
  console.log("Test Data Source has been initialized!");

  app.post("/users", async (req, res) => {
    const { email, hash, salt } = req.body;
    const user = new User();
    const profile = new Profile();
    user.email = email;
    user.password_hash = hash;
    user.password_salt = salt;
    user.email_confirmed = false;
    await AppDataSource.manager.save(user);
    profile.username = email;
    profile.user = user;
    await AppDataSource.manager.save(profile);
    res.status(201).send(`User created with id: ${user.user_id}`);
  });

  app.get("/users", async (req, res) => {
    const users = await AppDataSource.manager.find(User);
    res.json(users);
  });
};

export { app, initializeApp };
