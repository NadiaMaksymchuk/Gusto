import { RestaurantDto } from "../restaurantsDtos/restaurantDto";

export interface OrderWithItemsImagesAndRestaurantDto {
    id: number;
    orderStatus: number;
    orderDate: Date;
    deliveryTime: Date;
    restaurant: RestaurantDto;
    orderItems: OrderItemWithMenuItemImageDto[];
}

interface OrderItemWithMenuItemImageDto {
    id: number;
    menuItemId: number;
    quantity: number;
    totalPrice: number;
    menuItem: MenuItemWithImageDto;
}

interface MenuItemWithImageDto {
    name: string;
    description: string;
    price: number;
    image: MenuItemImageDto;
}

interface MenuItemImageDto {
    url: string;
}
