import { query } from "../db/sql.pool";
import UserDto from "../dtos/user.dto";

export class UserRepository {
  async getAll(): Promise<UserDto[]> {
    return new Promise((resolve, reject) => {
      query("Select * from users", function (err: any, res: any) {
        let users = [];
        if (res.rows) {
          users = res.rows.map((row: UserDto) => new UserDto(
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


  async addUser(newUser: UserDto): Promise<UserDto> {
    const values = [
      newUser.id,
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

    const queryText = `INSERT INTO users (id, city, language, firstName, lastName, dateOfBirth, email, numberPhone, imagePath, sex) VALUES (${values});`;

    return new Promise<UserDto>((resolve, reject) => {
      query(queryText, (err: any, res: any) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          if (res.rows && res.rows.length > 0) {
            const addedUser = res.rows[0];
            const user = new UserDto(
              addedUser.id,
              addedUser.city,
              addedUser.language,
              addedUser.firstName,
              addedUser.lastName,
              new Date(addedUser.dateOfBirth),
              addedUser.email,
              addedUser.numberPhone,
              addedUser.imagePath,
              addedUser.sex
            );
            console.log('User added: ', user);
            resolve(user);
          } else {
            reject("No user added");
          }
        }
      });
    });
  }
  
}

