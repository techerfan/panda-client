import { EventEmitter } from "./EventEmitter";
import { Logger, LogType } from "./logger/logger";
import { sectionNames } from "./logger/sectionNames";
import { Message, MessageType } from "./message";

export class Socket {
  socket: WebSocket;

  constructor(socket: WebSocket) {
    this.socket = socket;

    this.socket.onopen = this.onOpen;
    this.socket.onclose = this.onClose;
    this.socket.onerror = this.onError;
    this.socket.onmessage = this.onMessage;
  }

  onNewMessage = (callback: (msg: string) => void) => {
    EventEmitter.getInstance().addListener('', callback);
  } 
  
  subscribe(channelName: string, callback: (msg: string) => void) {
    EventEmitter.getInstance().addListener(channelName, callback);
  }

  private onOpen = (event: Event) => {
    Logger.getInstance().log(LogType.Info, sectionNames.main, 'Socket is open now...');
  }
  
  private onClose = (event: CloseEvent) => {
    Logger.getInstance().log(LogType.Notice, sectionNames.main, 'Closing Socket Connection...');
  }
  
  private onError = (event: Event) => {
    Logger.getInstance().log(LogType.Error, sectionNames.main, `An error occured.`);
  }
  
  private onMessage = (event: MessageEvent) => {
    try {
      const data: Message = JSON.parse(event.data);

      switch (data.MsgType) {
        case MessageType.Raw:
          EventEmitter.getInstance().dispatchMessage(data.Channel, data.Message);
          break;
      }
    } catch (error: any) {
      Logger.getInstance().log(LogType.Error, sectionNames.socket, error.message);
    }
  }
}
