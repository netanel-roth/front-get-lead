export interface MessageType {
    sender: string;
    text: string;
  }
export  interface MessageProps {
    sender: 'user' | 'system'; // סוג המוגדר לערכים האפשריים של 'sender'
    text: string;
  }
  