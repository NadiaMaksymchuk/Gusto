import { Router } from "express";
import { RestaurantsController } from "../controllers/restaurant.controller";

const restaurantsController = new RestaurantsController();

const router = Router();

router.post("/", restaurantsController.createRestaurant);
router.put("/:id", restaurantsController.updateRestaurant);
router.delete("/:id", restaurantsController.deleteRestaurant);
router.get("/:id", restaurantsController.getRestaurantById);
router.get("/", restaurantsController.getAllRestaurants);

export default router;