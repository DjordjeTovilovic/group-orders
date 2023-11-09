export interface CreateRoom {
  userId: string;
  cityCode: string;
}

export interface JoinRoom {
  userId: string;
  roomId: number;
}
