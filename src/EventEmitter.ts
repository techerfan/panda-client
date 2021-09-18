export class EventEmitter {
  private static instance: EventEmitter;
  private et: EventTarget;

  constructor() {
    this.et = new EventTarget();
  }

  static getInstance = (): EventEmitter => {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  dispatchMessage = (channelName: string, message: string): void => {
    EventEmitter.instance.et.dispatchEvent(new MessageEvent(channelName, {
      data: message,
    }));
  }

  addListener = (channelName: string, callback: (msg: string) => void) => {
    EventEmitter.instance.et.addEventListener(channelName, (event: any) => {
      callback(event.data);
    });
  }

  removeListener = (channelName: string, callback: () => void) => {
    EventEmitter.instance.et.removeEventListener('channelName', callback);
  } 
} 
