export interface IChatsRepository {
  createChat(name: string): Promise<void>
  getChatById(chatId: number)
  getChatsByUserId()
  getNumberOfUnreadMessages(chatId: number): Promise<number>
  deleteChat(chatId: number): Promise<void>
}
