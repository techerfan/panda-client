import { EventEmitter } from "../EventEmitter";
import { genSubscribeMessage, genUnsubscribeMessage, newMessage, stringify } from "../message";
import { Socket } from "../Socket"

export class SocketReceiver {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  publishMessage = (channel: string, msg: string) => {
    this.socket.socket!.send(stringify(newMessage(channel, msg)));
  }

  sendMessage = (msg: string) => {
    this.socket.socket!.send(stringify(newMessage('', msg)));
  }

  subscribe = (channelName: string, callback: (msg: string) => void) => {
    // for (const ch of this.socket.subscribedChannels) {
    //   if (ch.name === channelName) {
    //     return;
    //   }
    // }
    this.socket.socket!.send(stringify(genSubscribeMessage(channelName)));
    EventEmitter.getInstance().addListener(channelName, callback);
  } 

  unsubscribe = (channelName: string, callback: () => void) => {
    this.socket.socket!.send(stringify(genUnsubscribeMessage(channelName)));
    this.socket.subscribedChannels = this.socket.subscribedChannels.filter(el => {
      return el.name !== channelName;
    });
    EventEmitter.getInstance().removeListener(channelName, callback);
  }
}
