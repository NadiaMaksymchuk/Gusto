import { Request, Response } from 'express'
import { CreateMessageDto } from '../dtos/chatDtos/createMessagesDto'
import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import { IChatService } from '../services/interfaces/chat.service.interface'

@injectable()
export class ChatsController {
  constructor(@inject('IChatService') private readonly chatsService: IChatService) {}

  createChat = async (req: Request, res: Response) => {
    const name = req.body.name

    const response = await this.chatsService.createChat(name)
    return res.status(response.status).json(response)
  }

  getChatById = async (req: Request, res: Response) => {
    const chatId = +req.params.chatId

    const response = await this.chatsService.getChatById(chatId)
    return res.status(response.status).json(response)
  }

  getNumberOfUnreadMessages = async (req: Request, res: Response) => {
    const chatId = +req.params.chatId

    const response = await this.chatsService.getNumberOfUnreadMessages(chatId)

    return res.status(response.status).json(response)
  }

  getChatsByUserId = async (req: Request, res: Response) => {
    const response = await this.chatsService.getChatsByUserId()
    return res.status(response.status).json(response)
  }

  deleteChat = async (req: Request, res: Response) => {
    const chatId = +req.params.chatId

    const response = await this.chatsService.deleteChat(chatId)
    return res.status(response.status).json(response)
  }

  createMessage = async (req: Request, res: Response) => {
    const messageDto = req.body as CreateMessageDto

    const response = await this.chatsService.createMessage(messageDto)

    return res.status(response.status).json(response)
  }

  updateMessage = async (req: Request, res: Response) => {
    const messageId = +req.params.messageId
    const { text } = req.body as { text: string }

    const response = await this.chatsService.updateMessage(messageId, text)

    return res.status(response.status).json(response)
  }

  getFirst30MessagesByChatId = async (req: Request, res: Response) => {
    const chatId = +req.params.chatId

    const response = await this.chatsService.getFirst30MessagesByChatId(chatId)

    return res.status(response.status).json(response)
  }

  getUnreadAndLastMessagesAsync = async (req: Request, res: Response) => {
    const chatId = +req.params.chatId

    const response = await this.chatsService.getLastMessage(chatId)
    return res.status(response.status).json(response)
  }

  deleteMessage = async (req: Request, res: Response) => {
    const messageId = +req.params.messageId

    const response = await this.chatsService.deleteMessage(messageId)

    return res.status(response.status).json(response)
  }
}
