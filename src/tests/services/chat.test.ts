import { Container } from 'inversify'
import { IChatsRepository } from '../../repositories/interfaces/chat.repository.interface'
import { IMessagesRepository } from '../../repositories/interfaces/message.repository.interface'
import { ChatService } from '../../services/chat.service'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'

const mockMessagesRepository: IMessagesRepository = {
  createMessage: jest.fn(),
  getById: jest.fn(),
  updateMessage: jest.fn(),
  getLastMessage: jest.fn(),
  getFirst30MessagesByChatId: jest.fn(),
  deleteMessage: jest.fn(),
}

const mockChatsRepository: IChatsRepository = {
  createChat: jest.fn(),
  getChatById: jest.fn(),
  getChatsByUserId: jest.fn(),
  getNumberOfUnreadMessages: jest.fn(),
  deleteChat: jest.fn(),
}

const container = new Container()
container.bind<IMessagesRepository>('IMessagesRepository').toConstantValue(mockMessagesRepository)
container.bind<IChatsRepository>('IChatsRepository').toConstantValue(mockChatsRepository)

describe('ChatService', () => {
  let chatService: ChatService

  beforeEach(() => {
    chatService = container.resolve(ChatService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should create a new chat successfully', async () => {
    const newChatName = 'New Chat'

    ;(mockChatsRepository.createChat as jest.Mock).mockResolvedValueOnce(newChatName)

    const response = await chatService.createChat(newChatName)

    expect(response.status).toBe(HttpStatusCode.Created)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Chat created successfully')

    expect(mockChatsRepository.createChat).toHaveBeenCalledWith(newChatName)
  })

  test('should return a chat by id', async () => {
    const chatId = 1
    const expectedChat = { id: chatId, name: 'Existing Chat' }

    ;(mockChatsRepository.getChatById as jest.Mock).mockResolvedValueOnce(expectedChat)

    const response = await chatService.getChatById(chatId)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(expectedChat)
    expect(response.message).toBe('Chat retrieved successfully')
  })

  test('should return 404 for non-existent chat by id', async () => {
    const nonExistentChatId = 999

    ;(mockChatsRepository.getChatById as jest.Mock).mockResolvedValueOnce({})

    const response = await chatService.getChatById(nonExistentChatId)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Chat by id ${nonExistentChatId} not found`)
  })

  test('should return chats for a user successfully', async () => {
    const expectedChats = [
      { id: 1, name: 'Chat 1' },
      { id: 2, name: 'Chat 2' },
    ]

    ;(mockChatsRepository.getChatsByUserId as jest.Mock).mockResolvedValueOnce(expectedChats)

    const response = await chatService.getChatsByUserId()

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(expectedChats)
    expect(response.message).toBe('Chats retrieved successfully')
  })

  test('should return the number of unread messages for a chat', async () => {
    const chatId = 1
    const expectedUnreadMessageCount = 5

    ;(mockChatsRepository.getNumberOfUnreadMessages as jest.Mock).mockResolvedValueOnce(expectedUnreadMessageCount)

    const response = await chatService.getNumberOfUnreadMessages(chatId)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(expectedUnreadMessageCount)
    expect(response.message).toBe('Unread message count retrieved successfully')
  })

  test('should delete a chat successfully', async () => {
    const chatId = 1

    ;(mockChatsRepository.getChatById as jest.Mock).mockResolvedValueOnce({
      id: chatId,
      name: 'Existing Chat',
    })

    const response = await chatService.deleteChat(chatId)

    expect(response.status).toBe(HttpStatusCode.NoContent)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Chat deleted successfully')

    expect(mockChatsRepository.deleteChat).toHaveBeenCalledWith(chatId)
  })

  test('should return 404 for deleting a non-existent chat', async () => {
    const nonExistentChatId = 999

    ;(mockChatsRepository.getChatById as jest.Mock).mockResolvedValueOnce({})

    const response = await chatService.deleteChat(nonExistentChatId)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Chat by id ${nonExistentChatId} not found`)

    expect(mockChatsRepository.deleteChat).not.toHaveBeenCalled()
  })

  test('should create a new message successfully', async () => {
    const newMessage = { chatId: 1, text: 'Hello, World!' }

    ;(mockMessagesRepository.createMessage as jest.Mock).mockResolvedValueOnce(newMessage)

    const response = await chatService.createMessage(newMessage)

    expect(response.status).toBe(HttpStatusCode.Created)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Message created successfully')

    expect(mockMessagesRepository.createMessage).toHaveBeenCalledWith(newMessage)
  })

  test('should update a message successfully', async () => {
    const messageId = 1
    const newText = 'Updated message text'

    ;(mockMessagesRepository.getById as jest.Mock).mockResolvedValueOnce({
      id: messageId,
      text: 'Original message text',
    })

    const response = await chatService.updateMessage(messageId, newText)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Message updated successfully')

    expect(mockMessagesRepository.updateMessage).toHaveBeenCalledWith(messageId, newText)
  })

  test('should return 404 for updating a non-existent message', async () => {
    const nonExistentMessageId = 999
    const newText = 'Updated message text'

    ;(mockMessagesRepository.getById as jest.Mock).mockResolvedValueOnce({})

    const response = await chatService.updateMessage(nonExistentMessageId, newText)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Message by id ${nonExistentMessageId} not found`)

    expect(mockMessagesRepository.updateMessage).not.toHaveBeenCalled()
  })

  test('should get the last message in a chat', async () => {
    const chatId = 1
    const expectedLastMessage = {
      id: 1,
      text: 'Last message',
      timestamp: new Date(),
    }

    ;(mockMessagesRepository.getLastMessage as jest.Mock).mockResolvedValueOnce(expectedLastMessage)

    const response = await chatService.getLastMessage(chatId)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(expectedLastMessage)
    expect(response.message).toBe('Last message retrieved successfully')
  })

  test('should get the first 30 messages in a chat', async () => {
    const chatId = 1
    const expectedMessages = [
      { id: 1, text: 'Message 1', timestamp: new Date() },
      { id: 2, text: 'Message 2', timestamp: new Date() },
    ]

    ;(mockMessagesRepository.getFirst30MessagesByChatId as jest.Mock).mockResolvedValueOnce(expectedMessages)

    const response = await chatService.getFirst30MessagesByChatId(chatId)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(expectedMessages)
    expect(response.message).toBe('First 30 messages retrieved successfully')
  })

  test('should delete a message successfully', async () => {
    const messageId = 1

    ;(mockMessagesRepository.getById as jest.Mock).mockResolvedValueOnce({
      id: messageId,
      text: 'Existing message',
      timestamp: new Date(),
    })

    const response = await chatService.deleteMessage(messageId)

    expect(response.status).toBe(HttpStatusCode.NoContent)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Message deleted successfully')

    expect(mockMessagesRepository.deleteMessage).toHaveBeenCalledWith(messageId)
  })

  test('should return 404 for deleting a non-existent message', async () => {
    const nonExistentMessageId = 999

    ;(mockMessagesRepository.getById as jest.Mock).mockResolvedValueOnce({})

    const response = await chatService.deleteMessage(nonExistentMessageId)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Message by id ${nonExistentMessageId} not found`)

    expect(mockMessagesRepository.deleteMessage).not.toHaveBeenCalled()
  })
})
