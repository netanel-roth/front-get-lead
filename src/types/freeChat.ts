import { MessageType } from "./message";

export interface FreeChatProps {
    messages: MessageType[];
    onMessageSubmit: (message: MessageType) => void;
  }