import { EventEmitter } from './EventEmitter';
import { Logger, LogType } from './logger/logger';
import { sectionNames } from './logger/sectionNames';
import {
  Message, MessageType, stringify, newMessage,
} from './message';

export class Socket {
  socket: WebSocket;

  constructor(socket: WebSocket) {
    this.socket = socket;

    this.socket.onclose = this.onClose;
    this.socket.onmessage = this.onMessage;
  }

  onNewMessage = (callback: (msg: string) => void): void => {
    EventEmitter.getInstance().addListener('', callback);
  }

  subscribe = (channelName: string, callback: (msg: string) => void) => {
    EventEmitter.getInstance().addListener(channelName, callback);
  }

  send = (msg: string): void => {
    this.socket.send(stringify(newMessage('', msg)));
  }

  publish = (channel: string, msg: string): void => {
    this.socket.send(stringify(newMessage(channel, msg)));
  }

  private onClose = (event: CloseEvent) => {
    Logger.getInstance().log(LogType.Notice, sectionNames.main, 'Closing Socket Connection...');
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
