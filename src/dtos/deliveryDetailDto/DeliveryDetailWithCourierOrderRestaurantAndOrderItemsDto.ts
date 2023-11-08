export interface DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto {
  id: number; // Delivery Detail ID
  courierFirstName: string;
  courierLastName: string;
  orders: OrderWithRestaurantAndOrderItemsDto[]; // Array of orders
}

interface OrderWithRestaurantAndOrderItemsDto {
  id: number; // Order ID
  orderUserId: number; // User ID
  orderRestaurantId: number; // Restaurant ID
  orderStatus: number;
  orderDate: Date; // You may want to use a Date type here
  restaurant: RestaurantDto;
  orderItems: OrderItemWithMenuItemImageDto[]; // Array of order items
}

interface RestaurantDto {
  name: string;
  cuisineType: number;
  address: string;
  contacts: string;
}

interface OrderItemWithMenuItemImageDto {
  id: number; // Order Item ID
  menuItemId: number; // Menu Item ID
  orderItemQuantity: number;
  orderItemTotalPrice: number;
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
