import * as dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/user.route";
import { createDbIfDontExist } from "./db/script";
import authRoutes from './routes/auth';
import passport from 'passport';
import { v2 as cloudinary } from 'cloudinary';
import uploadPhotoRoutes from './routes/uploadPhoto.route';
import restaurantsRouter from './routes/restoraunt.route';
import couriersRouter from './routes/courier.route';
import menuItemsRouter from './routes/menuItem.route';
import orderItemsRouter from './routes/orderItems.route';
import ordersRouter from './routes/orders.route';

dotenv.config();
require('./strategies/google');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const PORT = process.env.PORT;

export const app = express()

app.use(express.json());
app.use(passport.initialize());

createDbIfDontExist();

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/photo", uploadPhotoRoutes);
app.use("/api/v1/restaurants", restaurantsRouter);
app.use("/api/v1/couriers", couriersRouter);
app.use("/api/v1/menuitems", menuItemsRouter);
app.use("/api/v1/orderitems", orderItemsRouter);
app.use("/api/v1/orders", ordersRouter);


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