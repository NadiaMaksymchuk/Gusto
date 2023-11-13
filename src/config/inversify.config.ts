import { Container } from "inversify";
import "reflect-metadata";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { UserRepository } from "../repositories/user.repository";
import { IUserService } from "../services/interfaces/user.service.interface";
import { UserService } from "../services/user.service";
import IRestaurantsRepository from "../repositories/interfaces/restorants.repository.interface";
import RestaurantsRepository from "../repositories/restaurants.repository";
import { IOrderItemsRepository } from "../repositories/interfaces/orderItems.repository.interface";
import { OrderItemsRepository } from "../repositories/orderItem.repository";
import { IOrdersRepository } from "../repositories/interfaces/order.repository.interface";
import { OrdersRepository } from "../repositories/order.repository";
import { INotificationsRepository } from "../repositories/interfaces/notification.repository.interface";
import NotificationsRepository from "../repositories/notification.repository";
import { IMessagesRepository } from "../repositories/interfaces/message.repository.interface";
import MessagesRepository from "../repositories/messages.repository";
import { IMenuItemsRepository } from "../repositories/interfaces/menuItems.repository.interface";
import MenuItemsRepository from "../repositories/menuItems.repository";
import { IImageRepository } from "../repositories/interfaces/image.repository.interface";
import { ImageRepository } from "../repositories/image.repository";
import { IDeliveryDetailsRepository } from "../repositories/interfaces/deliveryDetails.repository.interface";
import { DeliveryDetailsRepository } from "../repositories/deliveryDetails.repository";
import { ICouriersRepository } from "../repositories/interfaces/couries.repository.interface";
import CouriersRepository from "../repositories/couries.repository";
import { IChatsRepository } from "../repositories/interfaces/chat.repository.interface";
import { ChatsRepository } from "../repositories/chat.repository";
import { IRestaurantService } from "../services/interfaces/restaraunts.service.interface";
import { RestaurantService } from "../services/restaraunts.service";
import { IOrderItemsService } from "../services/interfaces/orderItems.service.interface";
import { OrderItemsService } from "../services/orderItems.service";
import { IOrderService } from "../services/interfaces/order.service";
import OrderService from "../services/order.service";
import { INotificationsService } from "../services/interfaces/notification.service.interface";
import { NotificationsService } from "../services/notification.service";
import { ChatService } from "../services/chat.service";
import { IChatService } from "../services/interfaces/chat.service.interface";
import { IMenuItemsService } from "../services/interfaces/menuItems.service.interface";
import MenuItemsService from "../services/menuItems.service";
import { IImageService } from "../services/interfaces/image.service";
import { CloundinaryService } from "../services/cloudinary.service";
import { IDeliveryDetailsService } from "../services/interfaces/deliveryDetails.service.interface";
import DeliveryDetailsService from "../services/deliveryDetails.service";
import { ICouriersService } from "../services/interfaces/couriers.service.interface";
import { CouriersService } from "../services/couriers.service";

const container = new Container();

container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<IUserService>("IUserService").to(UserService);

container
  .bind<IRestaurantsRepository>("IRestaurantsRepository")
  .to(RestaurantsRepository);
container.bind<IRestaurantService>("IRestaurantService").to(RestaurantService);

container
  .bind<IOrderItemsRepository>("IOrderItemsRepository")
  .to(OrderItemsRepository);
container.bind<IOrderItemsService>("IOrderItemsService").to(OrderItemsService);

container.bind<IOrdersRepository>("IOrdersRepository").to(OrdersRepository);
container.bind<IOrderService>("IOrderService").to(OrderService);

container
  .bind<INotificationsRepository>("INotificationsRepository")
  .to(NotificationsRepository);
container
  .bind<INotificationsService>("INotificationsService")
  .to(NotificationsService);

container
  .bind<IMessagesRepository>("IMessagesRepository")
  .to(MessagesRepository);
container.bind<IChatService>("IChatService").to(ChatService);

container
  .bind<IMenuItemsRepository>("IMenuItemsRepository")
  .to(MenuItemsRepository);
container.bind<IMenuItemsService>("IMenuItemsService").to(MenuItemsService);

container.bind<IImageRepository>("IImageRepository").to(ImageRepository);
container.bind<IImageService>("IImageService").to(CloundinaryService);

container
  .bind<IDeliveryDetailsRepository>("IDeliveryDetailsRepository")
  .to(DeliveryDetailsRepository);
container
  .bind<IDeliveryDetailsService>("IDeliveryDetailsService")
  .to(DeliveryDetailsService);

container
  .bind<ICouriersRepository>("ICouriersRepository")
  .to(CouriersRepository);
container.bind<ICouriersService>("ICouriersService").to(CouriersService);

container.bind<IChatsRepository>("IChatsRepository").to(ChatsRepository);

export default container;
