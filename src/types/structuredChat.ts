import { MessageType } from "./message";

export interface StructuredChatProps {
    messages: MessageType[];
    onMessageSubmit: (message: MessageType) => void;
    onProgressUpdate: (topic: any, value: any) => void;
  }