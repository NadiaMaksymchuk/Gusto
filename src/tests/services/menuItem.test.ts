import { Container } from 'inversify'
import { IMenuItemsRepository } from '../../repositories/interfaces/menuItems.repository.interface'
import MenuItemsService from '../../services/menuItems.service'
import { MenuItemsDto } from '../../dtos/restaurantsDtos/menuItemsDtos/menuItemsDto'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'
import { CreateMenuItemDto } from '../../dtos/restaurantsDtos/menuItemsDtos/createMenuDto'
import { UpdateMenuItemDto } from '../../dtos/restaurantsDtos/menuItemsDtos/updateMenuItems'

const mockMenuItemsRepository = {
  getAllByRestaurantId: jest.fn(),
  getMenuById: jest.fn(),
  addMenuItem: jest.fn(),
  getById: jest.fn(),
  updateMenuItem: jest.fn(),
  deleteMenuItem: jest.fn(),
}

const container = new Container()
container.bind<IMenuItemsRepository>('IMenuItemsRepository').toConstantValue(mockMenuItemsRepository)

describe('MenuItemsService', () => {
  let menuItemsService: MenuItemsService

  beforeEach(() => {
    menuItemsService = container.resolve(MenuItemsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('getAllByRestaurantId should return ApiResponse with status 200', async () => {
    const restaurantId = 1

    const mockMenuItems: MenuItemsDto[] = [
      {
        id: 1,
        name: 'Product A',
        description: 'Description for Product A',
        price: 19.99,
        imageUrl: 'product-a-image.jpg',
        type: 1,
      },
      {
        id: 2,
        name: 'Product B',
        description: 'Description for Product B',
        price: 29.99,
        imageUrl: 'product-b-image.jpg',
        type: 2,
      },
      {
        id: 3,
        name: 'Product C',
        description: 'Description for Product C',
        price: 14.99,
        imageUrl: 'product-c-image.jpg',
        type: 1,
      },
    ]

    mockMenuItemsRepository.getAllByRestaurantId.mockResolvedValueOnce(mockMenuItems)

    const response = await menuItemsService.getAllByRestaurantId(restaurantId)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(mockMenuItems)
    expect(response.message).toBe('Menu items retrieved successfully')
  })

  test('getMenuById should return ApiResponse with status 200 for existing menu item', async () => {
    const menuItemId = 1

    const mockMenuItem: MenuItemsDto = {
      id: 1,
      name: 'Product A',
      description: 'Description for Product A',
      price: 19.99,
      imageUrl: 'product-a-image.jpg',
      type: 1,
    }

    mockMenuItemsRepository.getMenuById.mockResolvedValueOnce(mockMenuItem)

    const response = await menuItemsService.getMenuById(menuItemId)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(mockMenuItem)
    expect(response.message).toBe('Menu item retrieved successfully')
  })

  test('getMenuById should return ApiResponse with status 404 for non-existing menu item', async () => {
    const menuItemId = 1

    mockMenuItemsRepository.getMenuById.mockResolvedValueOnce({})

    const response = await menuItemsService.getMenuById(menuItemId)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Menu item by id ${menuItemId} not found`)
  })

  test('addMenuItem should return ApiResponse with status 201', async () => {
    const newMenuItem: CreateMenuItemDto = {
      restaurantId: 1,
      name: 'Dish A',
      description: 'Description for Dish A',
      price: 14.99,
      imageId: 'dish-a-image',
      type: 1,
    }

    await menuItemsService.addMenuItem(newMenuItem)

    expect(mockMenuItemsRepository.addMenuItem).toHaveBeenCalledTimes(1)
    expect(mockMenuItemsRepository.addMenuItem).toHaveBeenCalledWith(newMenuItem)
  })

  test('updateMenuItem should return ApiResponse with status 200 for existing menu item', async () => {
    const menuItemId = 1
    const updatedMenuItemData: UpdateMenuItemDto = {
      name: 'Dish A',
      description: 'Description for Dish A',
      price: 14.99,
      imageId: 'dish-a-image',
      type: 1,
    }

    const mockMenuItem = {
      id: 1,
      name: 'Product A',
      description: 'Description for Product A',
      price: 19.99,
      imageUrl: 'product-a-image.jpg',
      type: 1,
    }

    mockMenuItemsRepository.getById.mockResolvedValueOnce(mockMenuItem)

    const response = await menuItemsService.updateMenuItem(menuItemId, updatedMenuItemData)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Menu item updated successfully')
    expect(mockMenuItemsRepository.updateMenuItem).toHaveBeenCalledTimes(1)
    expect(mockMenuItemsRepository.updateMenuItem).toHaveBeenCalledWith(menuItemId, updatedMenuItemData)
  })

  test('updateMenuItem should return ApiResponse with status 404 for non-existing menu item', async () => {
    const menuItemId = 1
    const updatedMenuItemData: UpdateMenuItemDto = {
      name: 'Dish A',
      description: 'Description for Dish A',
      price: 14.99,
      imageId: 'dish-a-image',
      type: 1,
    }

    mockMenuItemsRepository.getById.mockResolvedValueOnce({})

    const response = await menuItemsService.updateMenuItem(menuItemId, updatedMenuItemData)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Menu item by id ${menuItemId} not found`)
    expect(mockMenuItemsRepository.updateMenuItem).not.toHaveBeenCalled()
  })

  test('deleteMenuItem should return ApiResponse with status 204 for existing menu item', async () => {
    const menuItemId = 1

    const mockMenuItem = {
      id: 1,
      name: 'Product A',
      description: 'Description for Product A',
      price: 19.99,
      imageUrl: 'product-a-image.jpg',
      type: 1,
    }

    mockMenuItemsRepository.getById.mockResolvedValueOnce(mockMenuItem)

    const response = await menuItemsService.deleteMenuItem(menuItemId)

    expect(response.status).toBe(HttpStatusCode.NoContent)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Menu item deleted successfully')
    expect(mockMenuItemsRepository.deleteMenuItem).toHaveBeenCalledTimes(1)
    expect(mockMenuItemsRepository.deleteMenuItem).toHaveBeenCalledWith(menuItemId)
  })

  test('deleteMenuItem should return ApiResponse with status 404 for non-existing menu item', async () => {
    const menuItemId = 1

    mockMenuItemsRepository.getById.mockResolvedValueOnce({})

    const response = await menuItemsService.deleteMenuItem(menuItemId)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Menu item by id ${menuItemId} not found`)
    expect(mockMenuItemsRepository.deleteMenuItem).not.toHaveBeenCalled()
  })
})
