import * as dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/user.route";
import { createDbIfDontExist } from "./db/script";
import authRoutes from './routes/auth';
import passport from 'passport';
import { requireJwtMiddleware } from './middwares/authMiddleware'


dotenv.config();
require('./strategies/google');

const PORT = process.env.PORT;

export const app = express()

app.use(express.json());
app.use(passport.initialize());

createDbIfDontExist();

app.use("/api/v3/users", userRouter);
app.use("/api/auth", authRoutes);



app.use(express.urlencoded({
  extended: true
}));

const start = async () => {
    try {
      await app.listen(PORT);
      console.log(`Server running on port ${PORT}`);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  };
  
  start().catch((err) => {
    console.log(`Server stopped with err: ${err}`);
    process.exit(1);
  });