import { Router } from "express";
import { CouriersController } from "../controllers/couriers.controller";

const couriersController = new CouriersController();

const router = Router();

router.post("/", couriersController.createCourier);
router.get("/", couriersController.getAllCouriers);
router.get("/:id", couriersController.getCourierById);
router.get(
  "/availability/:status",
  couriersController.getCouriersByAvailabilityStatus,
);
router.put("/:id", couriersController.updateCourier);
router.put(
  "/:id/availability/:status",
  couriersController.setAvailabilityStatus,
);
router.delete("/:id", couriersController.deleteCourier);

export default router;
