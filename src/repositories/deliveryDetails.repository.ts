import { sqlPool } from "../db/sql.pool";
import { CreateDeliveryDetailDto } from "../dtos/deliveryDetailDto/createDeliveryDetailDto";
import { arrayToStringWithQuotes } from "../utils/request.util";

export class DeliveryDetailsRepository {
  async createDeliveryDetail(newDeliveryDetail: CreateDeliveryDetailDto) {
    const values = [
      newDeliveryDetail.orderId,
      newDeliveryDetail.courierId,
      newDeliveryDetail.quantity,
      newDeliveryDetail.totalPrice,
      newDeliveryDetail.deliveryDate,
      newDeliveryDetail.status,
    ];

    const queryText = `INSERT INTO DeliveryDetails (orderId, courierId, quantity, totalPrice, deliveryDate, status) VALUES (${arrayToStringWithQuotes(values)});`;

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

  async getDeliveryDetailsByCourierId(courierId: number): Promise<DeliveryDetailWithCourierAndOrderDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `
        SELECT dd.*, c.firstName AS courierFirstName, c.lastName AS courierLastName, o.orderStatus, o.orderDate
        FROM DeliveryDetails AS dd
        LEFT JOIN Couriers AS c ON dd.courierId = c.id
        LEFT JOIN Orders AS o ON dd.orderId = o.id
        WHERE dd.courierId = ${courierId};
        `,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          }

          let deliveryDetails = [];
          if (res) {
            deliveryDetails = res.map((row: DeliveryDetailWithCourierAndOrderDto) => ({
              ...row,
            }));
          }

          resolve(deliveryDetails);
        }
      );
    });
  }

  async getDeliveryDetailsByOrderId(orderId: number): Promise<DeliveryDetailWithCourierAndOrderDto[]> {
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
            deliveryDetails = res.map((row: DeliveryDetailWithCourierAndOrderDto) => ({
              ...row,
            }));
          }

          resolve(deliveryDetails);
        }
      );
    });
  }
}

