# Panda Client 

Also see the [server side package](https://github.com/techerfan/panda) written in go.

## Installation

```
npm install panda-client
```

## How to use?

First you need to initialize the package by calling `Panda` and then call `init`:
```javascript
import { panda } from 'panda-client';

const socket = panda('ws://your-path');
socket.init();
```

## Main functionalities

### subscribe:
By this method, you can subscribe to a channel and listen for new messages which will be published.

First parameter is the channel name that you want to subscribe to and the second parameter is a callback which will process each new message:
```typescript
socket.subscribe('channel_name', (message: string) => {
  // do something with the received message.
});
```

---

### unsubscribe:
As you can understand by the name of this method, it will unsubscribe from a channel.

It only accepts one parameter and it's the channel name:
```typescript
socket.unsubscribe('channel_name');
```
---

### send:
Use `send` in order to send messages directly to the server (no channel name is needed).

This method has only one parameter and that's the message itself:
```typescript
socket.send('your message');
```
---

### publish:
You can use this method to publish messages over a specified channel.

It has two parameters. First one is the channel name and second one is the message itself:
```typescript
socket.publish('channel_name', 'message');
```
---

## License 
Licensed under the [MIT License](/LICENSE).
