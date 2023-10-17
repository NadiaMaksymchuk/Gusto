import * as dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/user.route";
import { createDbIfDontExist } from "./db/script";

dotenv.config()

const PORT: number = 5000;

export const app = express()

app.use(express.json());

createDbIfDontExist();
//pool.end()

app.use("/api/v3/users", userRouter)

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