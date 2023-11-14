import { injectable } from 'inversify'
import { sqlPool } from '../db/sql.pool'
import { CreateRestaurantDto } from '../dtos/restaurantsDtos/createRestaurantDto'
import { RestaurantDto } from '../dtos/restaurantsDtos/restaurantDto'
import { UpdateRestaurantDto } from '../dtos/restaurantsDtos/updateRestorauntDto'
import { arrayToStringWithQuotes } from '../utils/request.util'
import IRestaurantsRepository from './interfaces/restorants.repository.interface'

@injectable()
class RestaurantsRepository implements IRestaurantsRepository {
  async createRestaurant(newRestaurant: CreateRestaurantDto) {
    const values = [...Object.values(newRestaurant)]

    const queryText = `INSERT INTO Restaurants (name, cuisineType, address, contacts) VALUES (${arrayToStringWithQuotes(
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

  async getAllRestaurants(): Promise<RestaurantDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query('SELECT * FROM Restaurants;', function (err, res) {
        if (err) {
          reject(err)
        }

        let restaurants = []
        if (res) {
          restaurants = res.map((row: RestaurantDto) => ({
            ...row,
          }))
        }

        resolve(restaurants)
      })
    })
  }

  async getRestaurantById(restaurantId: number): Promise<RestaurantDto | null> {
    return new Promise((resolve, reject) => {
      sqlPool.query(`SELECT * FROM Restaurants WHERE id = ${restaurantId};`, function (err, res) {
        if (err) {
          reject(err)
        }

        if (res && res.length > 0) {
          const restaurant = res[0]
          resolve(restaurant)
        } else {
          resolve(null)
        }
      })
    })
  }

  async updateRestaurant(restaurantId: number, updatedRestaurantData: UpdateRestaurantDto) {
    const queryText = `UPDATE Restaurants SET address = "${updatedRestaurantData.address}", contacts = "${updatedRestaurantData.contacts}" WHERE id = ${restaurantId};`

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  async deleteRestaurant(restaurantId: number) {
    const queryText = `DELETE FROM Restaurants WHERE id = ${restaurantId};`
    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }
}

export default RestaurantsRepository
