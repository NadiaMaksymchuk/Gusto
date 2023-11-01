export interface CreateOrderItemDto {
    orderId: number;
    menuItemId: number;
    quantity: number;
    totalPrice: number;
}