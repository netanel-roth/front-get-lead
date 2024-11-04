import { MessageType } from "./message";

export interface ChatProps {
    messages: MessageType[];
    onMessageSubmit: (message: MessageType) => void;
  }