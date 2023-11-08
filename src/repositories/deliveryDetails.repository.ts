import { sqlPool } from "../db/sql.pool";
import { DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto } from "../dtos/deliveryDetailDto/DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto";
import { CreateDeliveryDetailDto } from "../dtos/deliveryDetailDto/createDeliveryDetailDto";
import { DeliveryDetailWithCourierAndOrderDto } from "../dtos/deliveryDetailDto/deliveryDetailDto";
import { arrayToStringWithQuotes } from "../utils/request.util";

export class DeliveryDetailsRepository {
  async createDeliveryDetail(newDeliveryDetail: CreateDeliveryDetailDto) {
    const values = [...Object.values(newDeliveryDetail)];

    const queryText = `INSERT INTO DeliveryDetails (orderId, courierId, quantity, totalPrice, status) VALUES (${arrayToStringWithQuotes(
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

  async deleteDeliveryDetail(deliveryDetailId: number) {
    const queryText = `DELETE FROM DeliveryDetails WHERE id = ${deliveryDetailId};`;
    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async getDeliveryDetailsByCourierId(
    courierId: number,
  ): Promise<DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `
        SELECT dd.*, c.firstName AS courierFirstName, c.lastName AS courierLastName,
          o.id AS orderId, o.userId AS orderUserId, o.restaurantId AS orderRestaurantId,
          o.orderStatus, o.orderDate,
          r.name AS restaurantName, r.cuisineType, r.address, r.contacts,
          oi.id AS orderItemId, oi.menuItemId, oi.Quantity AS orderItemQuantity, oi.totalPrice AS orderItemTotalPrice,
          m.name AS menuItemName, m.description AS menuItemDescription, m.price AS menuItemPrice,
          i.url AS menuItemImageUrl
        FROM DeliveryDetails AS dd
        LEFT JOIN Couriers AS c ON dd.courierId = c.id
        LEFT JOIN Orders AS o ON dd.orderId = o.id
        LEFT JOIN Restaurants AS r ON o.restaurantId = r.id
        LEFT JOIN OrderItems AS oi ON dd.orderId = oi.orderId
        LEFT JOIN MenuItems AS m ON oi.menuItemId = m.id
        LEFT JOIN Images AS i ON m.imageId = i.id
        WHERE dd.courierId = ${courierId};
        `,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          }

          const deliveryDetails = new Map<
            number,
            DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto
          >();
          if (res) {
            for (const row of res) {
              const deliveryDetailId = row.id;
              if (!deliveryDetails.has(deliveryDetailId)) {
                deliveryDetails.set(deliveryDetailId, {
                  id: deliveryDetailId,
                  courierFirstName: row.courierFirstName,
                  courierLastName: row.courierLastName,
                  orders: [],
                });
              }

              const order = {
                id: row.orderId,
                orderUserId: row.orderUserId,
                orderRestaurantId: row.orderRestaurantId,
                orderStatus: row.orderStatus,
                orderDate: row.orderDate,
                restaurant: {
                  name: row.restaurantName,
                  cuisineType: row.cuisineType,
                  address: row.address,
                  contacts: row.contacts,
                },
                orderItems: [],
              };

              const orderItem = {
                id: row.orderItemId,
                menuItemId: row.menuItemId,
                orderItemQuantity: row.orderItemQuantity,
                orderItemTotalPrice: row.orderItemTotalPrice,
                menuItem: {
                  name: row.menuItemName,
                  description: row.menuItemDescription,
                  price: row.menuItemPrice,
                  image: {
                    url: row.menuItemImageUrl,
                  },
                },
              };

              deliveryDetails.get(deliveryDetailId)?.orders.push(order);
              order.orderItems.push(orderItem);
            }
          }

          resolve([...deliveryDetails.values()]);
        },
      );
    });
  }

  async getDeliveryDetailsByOrderId(
    orderId: number,
  ): Promise<DeliveryDetailWithCourierAndOrderDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `
        SELECT dd.*, c.firstName AS courierFirstName, c.lastName AS courierLastName, o.orderStatus, o.orderDate
        FROM DeliveryDetails AS dd
        LEFT JOIN Couriers AS c ON dd.courierId = c.id
        LEFT JOIN Orders AS o ON dd.orderId = o.id
        WHERE dd.orderId = ${orderId};
        `,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          }

          let deliveryDetails = [];
          if (res) {
            deliveryDetails = res.map(
              (row: DeliveryDetailWithCourierAndOrderDto) => ({
                ...row,
              }),
            );
          }

          resolve(deliveryDetails);
        },
      );
    });
  }
}
