import { sqlPool } from "../db/sql.pool";
import { CourierDto } from "../dtos/courierDto/courierDto";
import { CreateCourierDto } from "../dtos/courierDto/createCourierDto";
import { UpdateCourierDto } from "../dtos/courierDto/updateCourierDto";
import { arrayToStringWithQuotes } from "../utils/request.util";

class CouriersRepository {
  async createCourier(newCourier: CreateCourierDto) {
    const values = [...Object.values(newCourier)];

    const queryText = `INSERT INTO Couriers (firstName, lastName, email, numberPhone, vehicleNumber, availabilityStatus, sex, password, salt) VALUES (${arrayToStringWithQuotes(
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

  async getCourierByEmail(email: string): Promise<CourierDto> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `SELECT * FROM Couriers WHERE email = "${email}";`,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          }
          let courier = {} as CourierDto;
          if (res.length > 0) {
            courier = { ...res[0] };
          }

          resolve(courier);
        },
      );
    });
  }

  async getAllCouriers(): Promise<CourierDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query("SELECT * FROM Couriers;", function (err: any, res: any) {
        if (err) {
          reject(err);
        }

        let couriers = [];
        if (res) {
          couriers = res.map((row: CourierDto) => ({
            ...row,
          }));
        }

        resolve(couriers);
      });
    });
  }

  async getCourierById(courierId: number): Promise<CourierDto | null> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `SELECT * FROM Couriers WHERE id = ${courierId};`,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          }

          if (res && res.length > 0) {
            const courier = res[0];
            resolve(courier);
          } else {
            resolve(null);
          }
        },
      );
    });
  }

  async getCouriersByAvailabilityStatus(status: number): Promise<CourierDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `SELECT * FROM Couriers WHERE availabilityStatus = ${status};`,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          }

          let couriers = [];
          if (res) {
            couriers = res.map((row: CourierDto) => ({
              ...row,
            }));
          }

          resolve(couriers);
        },
      );
    });
  }

  async updateCourier(courierId: number, updatedCourierData: UpdateCourierDto) {
    const queryText = `UPDATE Couriers SET firstName = "${updatedCourierData.firstName}", lastName = "${updatedCourierData.lastName}", numberPhone = "${updatedCourierData.numberPhone}", vehicleNumber = "${updatedCourierData.vehicleNumber}", availabilityStatus = ${updatedCourierData.availabilityStatus} WHERE id = ${courierId};`;

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async setAvailabilityStatus(courierId: number, availabilityStatus: number) {
    const queryText = `UPDATE Couriers SET availabilityStatus = ${availabilityStatus} WHERE id = ${courierId};`;

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async deleteCourier(courierId: number) {
    const queryText = `DELETE FROM Couriers WHERE id = ${courierId};`;
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

export default CouriersRepository;
