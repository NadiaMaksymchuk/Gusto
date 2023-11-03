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
import deliveryDetailsRouter from './routes/deliveryDetail.router';
import bodyParser from 'body-parser';
import emailRouter from'./routes/email.route';
import { requireJwtMiddleware } from "./middwares/authMiddleware";
import notificationRouter from './routes/notification.route';
import chatRouter from './routes/chat.route';

dotenv.config();
require('./strategies/google');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const PORT = process.env.PORT;

export const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(bodyParser.json());

createDbIfDontExist();

app.use("/api/v1/users",requireJwtMiddleware, userRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/photo",requireJwtMiddleware, uploadPhotoRoutes);
app.use("/api/v1/restaurants",requireJwtMiddleware, restaurantsRouter);
app.use("/api/v1/couriers",requireJwtMiddleware, couriersRouter);
app.use("/api/v1/menuitems", requireJwtMiddleware,menuItemsRouter);
app.use("/api/v1/orderitems",requireJwtMiddleware, orderItemsRouter);
app.use("/api/v1/orders", requireJwtMiddleware,ordersRouter);
app.use("/api/v1/deliverydetails", requireJwtMiddleware,deliveryDetailsRouter);
app.use("/api/v1/email-send",requireJwtMiddleware, emailRouter);
app.use("/api/v1/notifications",requireJwtMiddleware, notificationRouter);
app.use("/api/v1/chats", requireJwtMiddleware,chatRouter);


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