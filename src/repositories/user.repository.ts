import { sqlPool } from "../db/sql.pool";
import UserDto from "../dtos/user.dto";
import { arrayToStringWithQuotes } from "../utils/request.util";
import {dbConn} from '../config/db.config'

export class UserRepository {
  async getAll(): Promise<UserDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query("Select * from users;", function (err: any, res: any) {
        if (err) {reject(err);}
        let users = [];
        if (res) {
          users = res.map((row: UserDto) => new UserDto(
            row.id,
            row.city,
            row.language,
            row.firstName,
            row.lastName,
            new Date(row.dateOfBirth),
            row.email,
            row.numberPhone,
            row.imagePath,
            row.sex,
          ))
        }

        resolve(users);
      });
    });
  }


  async addUser(newUser: UserDto) {
    const values = [
      newUser.city,
      newUser.language,
      newUser.firstName,
      newUser.lastName,
      newUser.dateOfBirth,
      newUser.email,
      newUser.numberPhone,
      newUser.imagePath,
      newUser.sex
    ];

    const queryText = `INSERT INTO users (city, language, firstName, lastName, dateOfBirth, email, numberPhone, imagePath, sex) VALUES (${arrayToStringWithQuotes(values)});`;

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {reject(err);}
        resolve();
      });
    });
  }

  async updateUser(userId: number, updatedUserData: UserDto) {
    const queryText = `UPDATE users SET city = ${updatedUserData.city}, language = ${updatedUserData.language}, firstName = "${updatedUserData.firstName}", lastName = "${updatedUserData.lastName}",dateOfBirth = "${updatedUserData.dateOfBirth}", email =  "${updatedUserData.email}", numberPhone = "${updatedUserData.numberPhone}", imagePath = "${updatedUserData.imagePath}", sex = ${updatedUserData.sex} WHERE id = ${userId};`;

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {reject(err);}
        resolve();
      });
    });
  }

  async deleteUser(id: number) {
    const queryText = `DELETE FROM users WHERE id = ${id};`;
    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {reject(err);}
        resolve();
      });
    });
  }
}
