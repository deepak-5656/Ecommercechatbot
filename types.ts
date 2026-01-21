
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CustomerDetails {
  email?: string;
  mobile?: string;
  orderId?: string;
}

export interface ChatSessionState {
  messages: Message[];
  isLoading: boolean;
  customerDetails: CustomerDetails;
}
