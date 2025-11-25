export type Role = 'user' | 'model';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}