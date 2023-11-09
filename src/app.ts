import * as dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/user.route";
import { createDbIfDontExist } from "./db/script";
import authRoutes from "./routes/auth";
import passport from "passport";
import { v2 as cloudinary } from "cloudinary";
import uploadPhotoRoutes from "./routes/uploadPhoto.route";
import restaurantsRouter from "./routes/restoraunt.route";
import couriersRouter from "./routes/courier.route";
import menuItemsRouter from "./routes/menuItem.route";
import orderItemsRouter from "./routes/orderItems.route";
import ordersRouter from "./routes/orders.route";
import deliveryDetailsRouter from "./routes/deliveryDetail.router";
import bodyParser from "body-parser";
import emailRouter from "./routes/email.route";
import { requireJwtMiddleware } from "./middwares/authMiddleware";
import notificationRouter from "./routes/notification.route";
import chatRouter from "./routes/chat.route";
import cors from "cors";
import { CreateMessageDto } from "./dtos/chatDtos/createMessagesDto";
import MessagesRepository from "./repositories/messages.repository";
import NotificationsRepository from "./repositories/notification.repository";
import { CreateNotificationDto } from "./dtos/notificationDtos/createNotificationDto";
import { errorMiddleware } from "./middwares/errorMiddleware";

const messagesRepository = new MessagesRepository();
const notificationRepository = new NotificationsRepository();

dotenv.config();
require("./strategies/google");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const PORT = process.env.PORT;

export const app = express();
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5000",
  }),
);
app.use(express.json());
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(errorMiddleware);

createDbIfDontExist();

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/photo", requireJwtMiddleware, uploadPhotoRoutes);
app.use("/api/v1/restaurants", requireJwtMiddleware, restaurantsRouter);
app.use("/api/v1/couriers", requireJwtMiddleware, couriersRouter);
app.use("/api/v1/menuitems", requireJwtMiddleware, menuItemsRouter);
app.use("/api/v1/orderitems", requireJwtMiddleware, orderItemsRouter);
app.use("/api/v1/orders", requireJwtMiddleware, ordersRouter);
app.use("/api/v1/deliverydetails", requireJwtMiddleware, deliveryDetailsRouter);
app.use("/api/v1/email-send", requireJwtMiddleware, emailRouter);
app.use("/api/v1/notifications", requireJwtMiddleware, notificationRouter);
app.use("/api/v1/chats", requireJwtMiddleware, chatRouter);

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const ioChat = new Server(server).of("/chat");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.js");
});

ioChat.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("send-message", async (message: string, room: string) => {
    const newMessage: CreateMessageDto = {
      chatId: +room,
      text: message,
    };
    await messagesRepository.createMessage(newMessage);
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room: string) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

const ioNotification = new Server(server).of("/notification");

ioNotification.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on(
    "send-notification",
    async (message: string, type: number, room: string) => {
      const newNotification: CreateNotificationDto = {
        userId: +room,
        text: message,
        type: type,
      };
      await notificationRepository.createNotification(newNotification);
      socket.to(room).emit("receive-notification", message, type);
    },
  );

  socket.on("join-room", (room: string) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log("listening on: 5000");
});
