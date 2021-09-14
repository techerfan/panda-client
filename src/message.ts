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

export const newMessage = (channel: string, message: string): Message => ({
  msgType: Number(MessageType.Raw),
  channel,
  message,
});

export const stringify = (msg: Message): string => JSON.stringify(msg);

export const parse = (msg: string): Message => JSON.parse(msg);
