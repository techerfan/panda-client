import { newMessage, stringify } from '../message';

test('Panda', () => {
  // expect(Panda('Erfan')).toBe('Hello Erfan');
});

test('new message', () => {
  const obj = newMessage('test', 'test message');
  expect(obj.message).toBe('test message');
});

test('stringify', () => {
  const obj = newMessage('test', 'test message');
  expect(stringify(obj)).toBe(JSON.stringify(obj));
});
