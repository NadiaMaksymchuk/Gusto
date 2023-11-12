import { injectable } from "inversify";
import { sqlPool } from "../db/sql.pool";
import { CreateOrderItemDto } from "../dtos/orderItemsDtos/createOrderItemDto";
import { UpdateOrderItemDto } from "../dtos/orderItemsDtos/updateOrderItemDto";
import { arrayToStringWithQuotes } from "../utils/request.util";
import { IOrderItemsRepository } from "./interfaces/orderItems.repository.interface";
import { OrderItemDto } from "../dtos/orderItemsDtos/orderItemsDto";

@injectable()
export class OrderItemsRepository implements IOrderItemsRepository {
  async createOrderItem(newOrderItem: CreateOrderItemDto) {
    const values = [...Object.values(newOrderItem)];

    const queryText = `INSERT INTO OrderItems (orderId, menuItemId, quantity, totalPrice) VALUES (${arrayToStringWithQuotes(
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

  async getById(id: number): Promise<OrderItemDto> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `Select * from OrderItems WHERE id = ${id};`,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          } else {
            let orderItem = null;
            if (res) {
              orderItem = { ...res[0] };
            }

            resolve(orderItem as OrderItemDto);
          }
        },
      );
    });
  }

  async updateOrderItem(
    orderItemId: number,
    updatedOrderItemData: UpdateOrderItemDto,
  ) {
    const queryText = `UPDATE OrderItems SET quantity = ${updatedOrderItemData.quantity}, totalPrice = ${updatedOrderItemData.totalPrice} WHERE id = ${orderItemId};`;

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async deleteOrderItem(orderItemId: number) {
    const queryText = `DELETE FROM OrderItems WHERE id = ${orderItemId};`;
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
