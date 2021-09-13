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

