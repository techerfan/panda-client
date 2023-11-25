import { Command } from './Command';
import { SocketReceiver } from './SocketReceiver';

export class SendCommand implements Command {
  private receiver: SocketReceiver;
  private message: string;

  constructor(receiver: SocketReceiver, message: string) {
    this.receiver = receiver;
    this.message = message;
  }

  execute = (): void => {
    this.receiver.sendMessage(this.message);
  };
}
