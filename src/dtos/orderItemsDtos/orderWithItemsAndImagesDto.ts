import { RestaurantDto } from '../restaurantsDtos/restaurantDto'

export class OrderWithItemsImagesAndRestaurantDto {
  id: number
  orderStatus: number
  orderDate: Date
  deliveryTime: Date
  restaurant: RestaurantDto
  orderItems: OrderItemWithMenuItemImageDto[]
}

export class OrderItemWithMenuItemImageDto {
  id: number
  menuItemId: number
  quantity: number
  totalPrice: number
  menuItem: MenuItemWithImageDto
}

export class MenuItemWithImageDto {
  name: string
  description: string
  price: number
  image: MenuItemImageDto
}

export class MenuItemImageDto {
  url: string
}
