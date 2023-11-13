import { Router } from "express";
import { NotificationsController } from "../controllers/notification.controller";
import container from "../config/inversify.config";
import { INotificationsService } from "../services/interfaces/notification.service.interface";

const notificationsService = container.get<INotificationsService>(
  "INotificationsService",
);

const notificationsController = new NotificationsController(
  notificationsService,
);
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
