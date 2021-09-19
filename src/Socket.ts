import { EventEmitter } from './EventEmitter';
import { Logger, LogType } from './logger/logger';
import { sectionNames } from './logger/sectionNames';
import {
  Message, MessageType, stringify, newMessage, genSubscribeMessage, genUnsubscribeMessage
} from './message';

export class Socket {
  socket: WebSocket;
  subscribedChannels: string[];

  constructor(socket: WebSocket) {
    this.socket = socket;
    this.socket.onmessage = this.onMessage;
    this.subscribedChannels = [];
  }

  onNewMessage = (callback: (msg: string) => void): void => {
    EventEmitter.getInstance().addListener('', callback);
  }

  subscribe = (channelName: string, callback: (msg: string) => void) => {
    this.socket.send(stringify(genSubscribeMessage(channelName)));
    this.subscribedChannels.push(channelName);
    EventEmitter.getInstance().addListener(channelName, callback);
  }

  unsubscribe = (channelName: string, callback: () => void) => {
    this.socket.send(stringify(genUnsubscribeMessage(channelName)));
    EventEmitter.getInstance().removeListener(channelName, callback);
  } 

  send = (msg: string): void => {
    this.socket.send(stringify(newMessage('', msg)));
  }

  publish = (channel: string, msg: string): void => {
    this.socket.send(stringify(newMessage(channel, msg)));
  }

  unsubscribeAll = () => {
    for (const ch of this.subscribedChannels) {
      this.socket.send(stringify(genUnsubscribeMessage(ch)))
    }
    Logger.getInstance().log(LogType.Notice, sectionNames.main, 'Closing Socket Connection...');
  }

  destroyConnection = () => {
    this.socket.close();
  }

  private onMessage = (event: MessageEvent) => {
    try {
      const data: Message = JSON.parse(event.data);

      switch (data.msgType) {
        case MessageType.Raw:
          EventEmitter.getInstance().dispatchMessage(data.channel, data.message);
          break;
      }
    } catch (error: any) {
      Logger.getInstance().log(LogType.Error, sectionNames.socket, error.message);
    }
  }
}
