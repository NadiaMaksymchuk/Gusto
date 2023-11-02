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
import { Request, Response } from "express";


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

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/photo", uploadPhotoRoutes);
app.use("/api/v1/restaurants", restaurantsRouter);
app.use("/api/v1/couriers", couriersRouter);
app.use("/api/v1/menuitems", menuItemsRouter);
app.use("/api/v1/orderitems", orderItemsRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/deliverydetails", deliveryDetailsRouter);
app.use("/api/v1/email-send", emailRouter);


app.use(express.urlencoded({
  extended: true
}));

app.post(
  '/send-email',
  (req: Request, res: Response) => {
    const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'nadiamaksy4uk@gmail.com', // Change to your recipient
  from: 'nadia29102003@gmail.com', // Change to your verified sender
  subject: 'Sending with Gusto is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
  }
);

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