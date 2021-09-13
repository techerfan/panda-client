export enum MessageType {
  Raw,
  Subscribe,
  Unsubscribe,
}

export interface Message {
  MsgType: MessageType;
  Channel: string;
  Message: string;
}

export const newMessage = (channel: string, message: string): Message => {
  return {
    MsgType: MessageType.Raw,
    Channel: channel,
    Message: message,
  };
}

export const stringify = (msg: Message): string => {
  return JSON.stringify(msg);
}

export const parse = (msg: string): Message => {
  return JSON.parse(msg);
}
