import { sqlPool } from '../db/sql.pool'
import { CreateUserDto } from '../dtos/userDtos/createUserDto'
import { UpdateUserDto } from '../dtos/userDtos/updateUserDto'
import { UserDto } from '../dtos/userDtos/user.dto'
import { arrayToStringWithQuotes } from '../utils/request.util'
import { IUserRepository } from './interfaces/user.repository.interface'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class UserRepository implements IUserRepository {
  async getAll(): Promise<UserDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query('Select * from users;', function (err, res) {
        if (err) {
          reject(err)
        }
        let users = []
        if (res) {
          users = res.map((row: UserDto) => ({
            ...row,
            dateOfBirth: new Date(row.dateOfBirth),
          }))
        }

        resolve(users)
      })
    })
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      sqlPool.query(`Select * from users WHERE email = "${email}";`, function (err, res) {
        if (err) {
          reject(err)
        } else {
          let user = null
          if (res) {
            user = { ...res[0] }
          }

          resolve(user as UserDto)
        }
      })
    })
  }

  async addUser(newUser: CreateUserDto) {
    const values = [...Object.values(newUser)]

    const queryText = `INSERT INTO users (city, language, firstName, lastName, dateOfBirth, email, numberPhone, sex, password, salt) VALUES (${arrayToStringWithQuotes(
      values,
    )});`

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  async updateUser(userId: number, updatedUserData: UpdateUserDto) {
    const queryText = `UPDATE users SET city = ${updatedUserData.city}, language = ${updatedUserData.language}, firstName = "${updatedUserData.firstName}", lastName = "${updatedUserData.lastName}",  numberPhone = "${updatedUserData.numberPhone}", imageId = "${updatedUserData.idImage}" WHERE id = ${userId};`

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  async deleteUser(id: number) {
    const queryText = `DELETE FROM users WHERE id = ${id};`
    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  async getUserById(id: number): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      sqlPool.query(`Select * from users WHERE id = ${id};`, function (err, res) {
        if (err) {
          reject(err)
        } else {
          let user = null
          if (res) {
            user = { ...res[0] }
          }

          resolve(user as UserDto)
        }
      })
    })
  }
}
