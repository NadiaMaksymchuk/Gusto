import { injectable } from 'inversify'
import { sqlPool } from '../db/sql.pool'
import { CreateMenuItemDto } from '../dtos/restaurantsDtos/menuItemsDtos/createMenuDto'
import { MenuItemsDto } from '../dtos/restaurantsDtos/menuItemsDtos/menuItemsDto'
import { UpdateMenuItemDto } from '../dtos/restaurantsDtos/menuItemsDtos/updateMenuItems'
import { arrayToStringWithQuotes } from '../utils/request.util'
import { IMenuItemsRepository } from './interfaces/menuItems.repository.interface'

@injectable()
export class MenuItemsRepository implements IMenuItemsRepository {
  async getAllByRestaurantId(restaurantId: number): Promise<MenuItemsDto[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT m.name, 
               m.description, 
               m.price, 
               m.type,
               i.url as imageUrl
        FROM (
          SELECT DISTINCT type
          FROM MenuItems
          JOIN Restaurants ON MenuItems.restaurantId = Restaurants.id
          LEFT JOIN Images ON MenuItems.imageId = Images.id
          WHERE Restaurants.id = ${restaurantId}
        ) AS subquery
        JOIN MenuItems AS m ON subquery.type = m.type
        JOIN Restaurants ON m.restaurantId = Restaurants.id
        LEFT JOIN Images AS i ON m.imageId = i.id
        WHERE Restaurants.id = ${restaurantId};
      `

      sqlPool.query(query, function (err, res) {
        if (err) {
          reject(err)
        }

        let menuItems = []
        if (res) {
          menuItems = res.map((row: MenuItemsDto) => ({
            ...row,
          }))
        }

        resolve(menuItems)
      })
    })
  }

  async getById(id: number): Promise<MenuItemsDto> {
    return new Promise((resolve, reject) => {
      sqlPool.query(`Select * from MenuItems WHERE id = ${id};`, function (err, res) {
        if (err) {
          reject(err)
        } else {
          let menuItem: MenuItemsDto
          if (res) {
            menuItem = { ...res[0] }
          }

          resolve(menuItem)
        }
      })
    })
  }

  async getMenuById(menuItemId: number): Promise<MenuItemsDto | null> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `SELECT MenuItems.id, MenuItems.name, MenuItems.description, MenuItems.price, Images.url as imageUrl
      FROM MenuItems
      LEFT JOIN Images ON MenuItems.imageId = Images.id
      WHERE MenuItems.id = ${menuItemId};`,
        function (err, res) {
          if (err) {
            reject(err)
          }

          if (res && res.length > 0) {
            const menuItem = res[0]
            resolve(menuItem)
          } else {
            resolve(null)
          }
        },
      )
    })
  }

  async addMenuItem(newMenuItem: CreateMenuItemDto) {
    const values = [...Object.values(newMenuItem)]

    const queryText = `INSERT INTO MenuItems (restaurantId, name, description, price, imageId, type) VALUES (${arrayToStringWithQuotes(
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

  async updateMenuItem(menuItemId: number, updatedMenuItemData: UpdateMenuItemDto) {
    const queryText = `UPDATE MenuItems SET name = "${updatedMenuItemData.name}", description = "${updatedMenuItemData.description}", price = ${updatedMenuItemData.price}, imageId = "${updatedMenuItemData.imageId}", type = ${updatedMenuItemData.type} WHERE id = ${menuItemId};`

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  async deleteMenuItem(menuItemId: number) {
    const queryText = `DELETE FROM MenuItems WHERE id = ${menuItemId};`
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

export default MenuItemsRepository
