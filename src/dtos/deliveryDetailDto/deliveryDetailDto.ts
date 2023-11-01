export interface DeliveryDetailWithCourierAndOrderDto {
    id: number;
    orderId: number;
    quantity: number;
    totalPrice: number;
    deliveryDate: Date;
    status: number;
    courierFirstName: string;
    courierLastName: string;
    orderStatus: number;
    orderDate: Date;
}
