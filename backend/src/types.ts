export interface Message {
  user: string;
  text: string;
  timestamp: number;
}

export interface Room {
  messages: Message[];
  users: string[];
}