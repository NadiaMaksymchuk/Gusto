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

const container = new Container();

container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<IUserService>("IUserService").to(UserService);

container.bind<IRestaurantsRepository>("IRestaurantsRepository").to(RestaurantsRepository);


container.bind<IOrderItemsRepository>("IOrderItemsRepository").to(OrderItemsRepository);


container.bind<IOrdersRepository>("IOrdersRepository").to(OrdersRepository);


container.bind<INotificationsRepository>("INotificationsRepository").to(NotificationsRepository);


container.bind<IMessagesRepository>("IMessagesRepository").to(MessagesRepository);


container.bind<IMenuItemsRepository>("IMenuItemsRepository").to(MenuItemsRepository);


container.bind<IImageRepository>("IImageRepository").to(ImageRepository);


container.bind<IDeliveryDetailsRepository>("IDeliveryDetailsRepository").to(DeliveryDetailsRepository);


container.bind<ICouriersRepository>("ICouriersRepository").to(CouriersRepository);


container.bind<IChatsRepository>("IChatsRepository").to(ChatsRepository);


export default container;
