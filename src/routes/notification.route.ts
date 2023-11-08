import { Router } from "express";
import { NotificationsController } from "../controllers/notification.controller";

const notificationsController = new NotificationsController();
const router = Router();

router.delete("/:notificationId", notificationsController.deleteNotification);
router.get(
  "/unread/:userId",
  notificationsController.getUnreadNotificationsByUserId,
);
router.put(
  "/read/:notificationId",
  notificationsController.readNotificationStatus,
);

export default router;
