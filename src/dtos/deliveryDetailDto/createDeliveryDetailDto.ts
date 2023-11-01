export interface CreateDeliveryDetailDto {
    orderId: number;
    courierId: number;
    quantity: number;
    totalPrice: number;
    deliveryDate: Date;
    status: number;
}