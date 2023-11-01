import { RestaurantDto } from "../restaurantsDtos/restaurantDto";

export interface OrderWithItemsImagesAndRestaurantDto {
    id: number;
    orderStatus: number;
    orderDate: Date;
    deliveryTime: Date;
    restaurant: RestaurantDto;
    orderItems: OrderItemWithMenuItemImageDto[];
}

export interface OrderItemWithMenuItemImageDto {
    id: number;
    menuItemId: number;
    quantity: number;
    totalPrice: number;
    menuItem: MenuItemWithImageDto;
}

export interface MenuItemWithImageDto {
    name: string;
    description: string;
    price: number;
    image: MenuItemImageDto;
}

export interface MenuItemImageDto {
    url: string;
}
