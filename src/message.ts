export enum MessageType {
  Raw,
  Subscribe,
  Unsubscribe,
}

export interface Message {
  msgType: MessageType;
  channel: string;
  message: string;
}

export const newMessage = (channel: string, message: string): Message => {
  return {
    msgType: MessageType.Raw,
    channel: channel,
    message: message,
  };
}

export const stringify = (msg: Message): string => {
  return JSON.stringify(msg);
}

export const parse = (msg: string): Message => {
  return JSON.parse(msg);
}
