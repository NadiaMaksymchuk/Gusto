export interface OrderWithItemsAndImagesDto {
    id: number; // Order ID
    userId: number; // User ID
    restaurantId: number; // Restaurant ID
    orderStatus: number;
    orderDate: Date; // You may want to use a Date type here
    deliveryTime: Date; // You may want to use a Date type here
    orderItems: OrderItemWithMenuItemDto[]; // Array of order items
  }
  
  interface OrderItemWithMenuItemDto {
    id: number; // Order Item ID
    menuItemId: number; // Menu Item ID
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