import { Command } from './Command';

export class Queue {
  private static instance: Queue;
  private queueArr: Command[];
  private isQueueActive: boolean;

  constructor() {
    this.isQueueActive = false;
    this.queueArr = [];
  }

  static getInstance = (): Queue => {
    if (!Queue.instance) {
      Queue.instance = new Queue();
    }
    return Queue.instance;
  };

  start = () => {
    if (!this.isQueueActive) {
      this.isQueueActive = true;
    }
  };

  stop = () => {
    if (this.isQueueActive) {
      this.isQueueActive = false;
    }
  };

  add = (command: Command) => {
    this.queueArr.push(command);
    if (this.isQueueActive) {
      this.processQueue();
    }
  };

  remove = (command: Command) => {
    this.queueArr = this.queueArr.filter((c) => c !== command);
  };

  private processQueue = () => {
    while (this.queueArr.length > 0) {
      this.queueArr[0].execute();
      this.queueArr.shift();
    }
    // if (this.queueArr.length > 0) {
    //   this.queueArr[0].execute();
    //   this.queueArr.shift();
    // }

    // if (!this.isQueueActive) {
    //   break;
    // }
  };
}
