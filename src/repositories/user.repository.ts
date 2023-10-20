import { sqlPool } from "../db/sql.pool";
import { arrayToStringWithQuotes } from "../utils/request.util";
import {dbConn} from '../config/db.config'
import UserDto from "../dtos/userDtos/user.dto";
import CreateUserDto from "../dtos/userDtos/createUserDto";

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

  async getUserByEmail(email: string): Promise<UserDto> {
    return new Promise((resolve, reject) => { 
      sqlPool.query(`Select * from users WHERE email = ${email};`, function (err: any, res: any) {
        if (err) {reject(err);}
        let user = {} as UserDto;
        if(res) {
          user = {...res};
        }

        resolve(user)
      })
    });
  }

  async addUser(newUser: CreateUserDto) {
    const values = [
      ...Object.values(newUser),
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
