export interface Session {
  id: number;
  dateCreated: number;
  email: string;
  isCourier: boolean;
  issued: number;
  expires: number;
}
