export class DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto {
  id: number
  courierFirstName: string
  courierLastName: string
  orders: OrderWithRestaurantAndOrderItemsDto[]
}

class OrderWithRestaurantAndOrderItemsDto {
  id: number
  orderUserId: number
  orderRestaurantId: number
  orderStatus: number
  orderDate: Date
  restaurant: RestaurantDto
  orderItems: OrderItemWithMenuItemImageDto[]
}

class RestaurantDto {
  name: string
  cuisineType: number
  address: string
  contacts: string
}

class OrderItemWithMenuItemImageDto {
  id: number
  menuItemId: number
  orderItemQuantity: number
  orderItemTotalPrice: number
  menuItem: MenuItemWithImageDto
}

class MenuItemWithImageDto {
  name: string
  description: string
  price: number
  image: MenuItemImageDto
}

class MenuItemImageDto {
  url: string
}
