import { injectable } from "inversify";
import { sqlPool } from "../db/sql.pool";
import { OrderWithItemsImagesAndRestaurantDto } from "../dtos/orderItemsDtos/orderWithItemsAndImagesDto";
import { CreateOrderDto } from "../dtos/ordersDto/createOrderDto";
import { arrayToStringWithQuotes } from "../utils/request.util";
import { IOrdersRepository } from "./interfaces/order.repository.interface";
import { OrderDto } from "../dtos/ordersDto/orderDto";

@injectable()
export class OrdersRepository  implements IOrdersRepository {
  async createOrder(newOrder: CreateOrderDto) {
    const values = [...Object.values(newOrder)];

    const queryText = `INSERT INTO Orders (userId, restaurantId, orderStatus, orderDate) VALUES (${arrayToStringWithQuotes(
      values,
    )});`;

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async getById(id: number): Promise<OrderDto> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `Select * from OrderItems WHERE id = ${id};`,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          } else {
            let order = null;
            if (res) {
              order = { ...res[0] };
            }

            resolve(order as OrderDto);
          }
        },
      );
    });
  }

  async getOrdersWithOrderItemsAndImagesByUserAndStatus(
    userId: number,
    orderStatus: number,
  ): Promise<OrderWithItemsImagesAndRestaurantDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `
        SELECT o.id AS orderId, o.userId, o.restaurantId, o.orderStatus, o.orderDate, o.deliveryTime,
          oi.id AS orderItemId, oi.menuItemId, oi.Quantity, oi.totalPrice,
          m.name AS menuItemName, m.description AS menuItemDescription, m.price AS menuItemPrice,
          i.url AS menuItemImageUrl,
          r.name AS restaurantName, r.cuisineType, r.address, r.contacts
        FROM Orders AS o
        LEFT JOIN OrderItems AS oi ON o.id = oi.orderId
        LEFT JOIN MenuItems AS m ON oi.menuItemId = m.id
        LEFT JOIN Images AS i ON m.imageId = i.id
        LEFT JOIN Restaurants AS r ON o.restaurantId = r.id
        WHERE o.userId = ${userId} AND o.orderStatus = ${orderStatus};
        `,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          }

          const ordersWithItemsImagesAndRestaurant = new Map<
            number,
            OrderWithItemsImagesAndRestaurantDto
          >();
          if (res) {
            for (const row of res) {
              const orderId = row.orderId;
              if (!ordersWithItemsImagesAndRestaurant.has(orderId)) {
                ordersWithItemsImagesAndRestaurant.set(orderId, {
                  id: orderId,
                  orderStatus: row.orderStatus,
                  orderDate: row.orderDate,
                  deliveryTime: row.deliveryTime,
                  restaurant: {
                    name: row.name,
                    cuisineType: row.cuisineType,
                    address: row.address,
                    contacts: row.contacts,
                    id: row.id,
                  },
                  orderItems: [],
                });
              }

              const orderItem = {
                id: row.orderItemId,
                menuItemId: row.menuItemId,
                quantity: row.Quantity,
                totalPrice: row.totalPrice,
                menuItem: {
                  name: row.menuItemName,
                  description: row.menuItemDescription,
                  price: row.menuItemPrice,
                  image: {
                    url: row.menuItemImageUrl,
                  },
                },
              };

              ordersWithItemsImagesAndRestaurant
                .get(orderId)
                ?.orderItems.push(orderItem);
            }
          }

          resolve([...ordersWithItemsImagesAndRestaurant.values()]);
        },
      );
    });
  }

  async deleteOrder(orderId: number) {
    const queryText = `DELETE FROM Orders WHERE id = ${orderId};`;
    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async updateOrderStatus(orderId: number, newStatus: number) {
    const queryText = `UPDATE Orders SET orderStatus = ${newStatus} WHERE id = ${orderId};`;
    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async updateDeliveryTime(orderId: number, newDeliveryTime: string) {
    const queryText = `UPDATE Orders SET deliveryTime = "${newDeliveryTime}" WHERE id = ${orderId};`;
    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}
