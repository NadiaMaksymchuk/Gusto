class ChatPersonDto {
  Email: string
  FirstName: string
  LastName: string
  LastMessageDate: Date | null
  IsRead: boolean | null
  LastMessage: string
  NumberOfUnreadMessages: number | null
  ChatId: number
  ImageUrl: string
}

export default ChatPersonDto
