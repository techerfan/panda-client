import { EventEmitter } from './EventEmitter';
import { Logger, LogType } from './logger/logger';
import { sectionNames } from './logger/sectionNames';
import { Config } from './index';
import {
  Message, MessageType, stringify, newMessage, genSubscribeMessage, genUnsubscribeMessage
} from './message';

export class Socket {
  socket: WebSocket | null = null; 
  subscribedChannels: string[];
  path: string;
  config: Config;

  constructor(path: string, config: Config) {
    this.path = path;
    this.config = config;
    this.subscribedChannels = [];
    if (!this.config || !this.config.autoReconnect) {
      this.config.autoReconnect = true;
    }
  }

  init = (conf?: { returnSocket: boolean }): Promise<Socket> | void => {
    this.socket = new WebSocket(this.path);
    this.socket.onmessage = this.onMessage;
    this.socket.onclose = this.onClose;
    if ((conf && conf.returnSocket !== false) || !conf) {
      return new Promise((resolve, reject) => {
        this.socket!.onopen = (event) => {
          if (this.config.onOpen) {
            this.config.onOpen(event);
          }
          resolve(this);
        }
  
        this.socket!.onerror = (event) => {
          if (this.config.onError) {
            this.config.onError(event);
          }
          reject(`Could not connect to ${this.path}`);
        } 
      });
    }
  }

  onNewMessage = (callback: (msg: string) => void): void => {
    EventEmitter.getInstance().addListener('', callback);
  }

  subscribe = (channelName: string, callback: (msg: string) => void) => {
    for (const ch of this.subscribedChannels) {
      if (ch === channelName) {
        return
      }
    }
    this.socket!.send(stringify(genSubscribeMessage(channelName)));
    this.subscribedChannels.push(channelName);
    EventEmitter.getInstance().addListener(channelName, callback);
  }

  unsubscribe = (channelName: string, callback: () => void) => {
    this.socket!.send(stringify(genUnsubscribeMessage(channelName)));
    this.subscribedChannels = this.subscribedChannels.filter((el, index) => {
      return el !== channelName;
    });
    EventEmitter.getInstance().removeListener(channelName, callback);
  } 

  send = (msg: string): void => {
    this.socket!.send(stringify(newMessage('', msg)));
  }

  publish = (channel: string, msg: string): void => {
    this.socket!.send(stringify(newMessage(channel, msg)));
  }

  unsubscribeAll = () => {
    for (const ch of this.subscribedChannels) {
      this.socket!.send(stringify(genUnsubscribeMessage(ch)))
    }
    Logger.getInstance().log(LogType.Notice, sectionNames.main, 'Closing Socket Connection...');
  }

  destroyConnection = () => {
    this.socket!.close();
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

  private onClose = (event: Event) => {
    if (this.config.onClose) {
      this.config.onClose(event);
    }
    if (this.config.autoReconnect) {
      setTimeout(() => {
        this.init({ returnSocket: false });
      }, 1000);
    }
  }
}
