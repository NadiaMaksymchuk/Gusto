export interface CreateOrderDto {
    userId: string;
    restaurantId: number;
    orderStatus: number;
    orderDate: string;
}