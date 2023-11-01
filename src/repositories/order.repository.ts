import { sqlPool } from "../db/sql.pool";
import { OrderWithItemsAndImagesDto } from "../dtos/orderItemsDtos/orderWithItemsAndImagesDto";
import { CreateOrderDto } from "../dtos/ordersDto/createOrderDto";
import { arrayToStringWithQuotes } from "../utils/request.util";

export class OrdersRepository {
  async createOrder(newOrder: CreateOrderDto) {
    const values = [
        ...Object.values(newOrder),

    ];

    const queryText = `INSERT INTO Orders (userId, restaurantId, orderStatus, orderDate, deliveryTime) VALUES (${arrayToStringWithQuotes(values)});`;

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async getOrdersWithOrderItemsAndImagesByUserAndStatus(userId: number, orderStatus: number): Promise<OrderWithItemsAndImagesDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `
        SELECT o.id AS orderId, o.userId, o.restaurantId, o.orderStatus, o.orderDate, o.deliveryTime,
          oi.id AS orderItemId, oi.menuItemId, oi.Quantity, oi.totalPrice,
          m.name AS menuItemName, m.description AS menuItemDescription, m.price AS menuItemPrice,
          i.url AS menuItemImageUrl
        FROM Orders AS o
        LEFT JOIN OrderItems AS oi ON o.id = oi.orderId
        LEFT JOIN MenuItems AS m ON oi.menuItemId = m.id
        LEFT JOIN Image AS i ON m.imageId = i.id
        WHERE o.userId = ${userId} AND o.orderStatus = ${orderStatus};
        `,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          }

          const ordersWithItemsAndImages = new Map<number, OrderWithItemsAndImagesDto>();
          if (res) {
            for (const row of res) {
              const orderId = row.orderId;
              if (!ordersWithItemsAndImages.has(orderId)) {
                ordersWithItemsAndImages.set(orderId, {
                  id: orderId,
                  userId: row.userId,
                  restaurantId: row.restaurantId,
                  orderStatus: row.orderStatus,
                  orderDate: row.orderDate,
                  deliveryTime: row.deliveryTime,
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

              ordersWithItemsAndImages.get(orderId)?.orderItems.push(orderItem);
            }
          }

          resolve([...ordersWithItemsAndImages.values()]);
        }
      );
    });
  }

  async getOrdersWithOrderItemsAndImagesByCourierAndStatus(courierId: number, orderStatus: number): Promise<OrderWithItemsAndImagesDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `
        SELECT o.id AS orderId, o.userId, o.restaurantId, o.orderStatus, o.orderDate, o.deliveryTime,
          oi.id AS orderItemId, oi.menuItemId, oi.Quantity, oi.totalPrice,
          m.name AS menuItemName, m.description AS menuItemDescription, m.price AS menuItemPrice,
          i.url AS menuItemImageUrl
        FROM Orders AS o
        LEFT JOIN OrderItems AS oi ON o.id = oi.orderId
        LEFT JOIN MenuItems AS m ON oi.menuItemId = m.id
        LEFT JOIN Image AS i ON m.imageId = i.id
        WHERE o.id IN (
          SELECT orderId
          FROM OrderItems
          WHERE menuItemId IN (
            SELECT id
            FROM MenuItems
            WHERE restaurantId IN (
              SELECT restaurantId
              FROM Restaurants
              WHERE courierId = ${courierId}
            )
          )
        ) AND o.orderStatus = ${orderStatus};
        `,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          }

          const ordersWithItemsAndImages = new Map<number, OrderWithItemsAndImagesDto>();
          if (res) {
            for (const row of res) {
              const orderId = row.orderId;
              if (!ordersWithItemsAndImages.has(orderId)) {
                ordersWithItemsAndImages.set(orderId, {
                  id: orderId,
                  userId: row.userId,
                  restaurantId: row.restaurantId,
                  orderStatus: row.orderStatus,
                  orderDate: row.orderDate,
                  deliveryTime: row.deliveryTime,
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

              ordersWithItemsAndImages.get(orderId)?.orderItems.push(orderItem);
            }
          }

          resolve([...ordersWithItemsAndImages.values()]);
        }
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

  async updateDeliveryTime(orderId: number, newDeliveryTime: Date) {
    const queryText = `UPDATE Orders SET deliveryTime = "${newDeliveryTime.toISOString()}" WHERE id = ${orderId};`;
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
