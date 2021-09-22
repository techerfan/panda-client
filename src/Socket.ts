import { EventEmitter } from './EventEmitter';
import { Logger, LogType } from './logger/logger';
import { sectionNames } from './logger/sectionNames';
import { Config } from './index';
import { Message, MessageType, stringify, genUnsubscribeMessage } from './message';
import { Queue } from './Queue/Queue';
import { PublishCommand } from './Queue/PublishCommand';
import { SocketReceiver } from './Queue/SocketReceiver';
import { SendCommand } from './Queue/SendCommand';
import { SubscribeCommand } from './Queue/SubscribeCommand';
import { UnsubscribeCommand } from './Queue/UnsubsctibeCommand';

interface Channel {
  name: string;
  callback: (msg: string) => void;
}

export class Socket {
  socket: WebSocket | null = null;
  subscribedChannels: Channel[];
  path: string;
  config: Config;
  private QueueManager: Queue;
  private Receiver: SocketReceiver;

  constructor(path: string, config: Config) {
    this.path = path;
    this.config = config;
    this.subscribedChannels = [];
    if (!this.config || !this.config.autoReconnect) {
      this.config.autoReconnect = true;
    }
    this.QueueManager = Queue.getInstance();
    this.Receiver = new SocketReceiver(this);
  }

  init = () => {
    try {
      this.socket = new WebSocket(this.path);
      this.socket.onmessage = this.onMessage;
      this.socket.onclose = this.onClose;
      this.socket!.onopen = this.onOpen;
      this.socket!.onerror = this.onError;

      this.subscribeToDefinedChannels();
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

  unsubscribe = (channelName: string, callback: () => void) => {
    this.QueueManager.add(new UnsubscribeCommand(this.Receiver, channelName, callback));
  };

  send = (msg: string): void => {
    this.QueueManager.add(new SendCommand(this.Receiver, msg));
  };

  publish = (channel: string, msg: string): void => {
    this.QueueManager.add(new PublishCommand(this.Receiver, channel, msg));
  };

  // unsubscribeAll = () => {
  //   for (const ch of this.subscribedChannels) {
  //     this.socket!.send(stringify(genUnsubscribeMessage(ch.name)));
  //   }
  // };

  destroyConnection = () => {
    this.socket!.close();
  };

  private subscribeToDefinedChannels = () => {
    for (const ch of this.subscribedChannels) {
      // EventEmitter.getInstance().removeListener(ch.name, ch.callback);
      EventEmitter.getInstance().addListener(ch.name, ch.callback);
    }
  };

  private onOpen = (event: Event) => {
    if (this.config.onOpen) {
      this.config.onOpen(event);
    }
    this.QueueManager.start();
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
    if (this.config.onClose) {
      this.config.onClose(event);
    }
    if (this.config.autoReconnect) {
      setTimeout(() => {
        this.init();
      }, 1000);
    }
    this.QueueManager.stop();
  };
}
