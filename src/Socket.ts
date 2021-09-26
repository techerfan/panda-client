import { EventEmitter } from './EventEmitter';
import { Logger, LogType } from './logger/logger';
import { sectionNames } from './logger/sectionNames';
import { Config } from './index';
import { Message, MessageType } from './message';
import { Queue } from './Queue/Queue';
import { PublishCommand } from './Queue/PublishCommand';
import { SocketReceiver } from './Queue/SocketReceiver';
import { SendCommand } from './Queue/SendCommand';
import { SubscribeCommand } from './Queue/SubscribeCommand';
import { UnsubscribeCommand } from './Queue/UnsubsctibeCommand';

export interface Channel {
  name: string;
  callback: (msg: string) => void;
  active: boolean;
}

export class Socket {
  socket: WebSocket | null = null;
  subscribedChannels: Channel[];
  path: string;
  config: Config;
  private QueueManager: Queue;
  private Receiver: SocketReceiver;
  private isDestroyed: boolean;

  constructor(path: string, config: Config) {
    this.path = path;
    this.config = config;
    this.subscribedChannels = [];
    if (!this.config || !this.config.autoReconnect) {
      this.config.autoReconnect = true;
    }
    this.QueueManager = Queue.getInstance();
    this.Receiver = new SocketReceiver(this);
    this.isDestroyed = false;
  }

  init = () => {
    try {
      this.socket = new WebSocket(this.path);
      this.socket.onmessage = this.onMessage;
      this.socket.onclose = this.onClose;
      this.socket.onopen = this.onOpen;
      this.socket.onerror = this.onError;
    } catch (error) {
      console.log(error);
    }
  };

  onNewMessage = (callback: (msg: string) => void): void => {
    EventEmitter.getInstance().addListener('', callback);
  };

  subscribe = (channelName: string, callback: (msg: string) => void) => {
    this.QueueManager.add(new SubscribeCommand(this.Receiver, channelName, callback));
  };

  unsubscribe = (channelName: string) => {
    this.QueueManager.add(new UnsubscribeCommand(this.Receiver, channelName));
  };

  send = (msg: string): void => {
    this.QueueManager.add(new SendCommand(this.Receiver, msg));
  };

  publish = (channel: string, msg: string): void => {
    this.QueueManager.add(new PublishCommand(this.Receiver, channel, msg));
  };

  private unsubscribeAll = () => {
    for (const ch of this.subscribedChannels) {
      this.QueueManager.add(new UnsubscribeCommand(this.Receiver, ch.name));
    }
  };
  
  destroyConnection = () => {
    this.QueueManager.stop();
    this.isDestroyed = true;
    this.unsubscribeAll();
    this.socket!.close();
  };

  private deactivateChannels = () => {
    for (const ch of this.subscribedChannels) {
      ch.active = false;
      EventEmitter.getInstance().removeListener(ch.name)
    }
  };
  
  private subscribeToDefinedChannels = () => {
    for (const ch of this.subscribedChannels) {
      this.subscribe(ch.name, ch.callback);
    }
  };

  private onOpen = (event: Event) => {
    if (this.config.onOpen) {
      this.config.onOpen(event);
    }
    this.QueueManager.start();
    this.subscribeToDefinedChannels();
  };

  private onError = (event: Event) => {
    if (this.config.onError) {
      this.config.onError(event);
    }
    this.QueueManager.stop();
  };

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
  };

  private onClose = (event: Event) => {
    if (this.config.onClose && !this.isDestroyed) {
      this.config.onClose(event);
    }
    if (this.config.autoReconnect && !this.isDestroyed) {
      setTimeout(() => {
        this.init();
      }, 1000);
    }
    this.deactivateChannels();
  };
}
