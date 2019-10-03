# Complex State Management

Content

- How to use the `reducer pattern` to manage more complex state
- How to use WebSocket

## The Reducer Pattern

### JavaScript Reduce Function

- Reduce takes in an array of values and output a single value

To calculate the sum of values in an array, we can do it using forEach:

```js
const numbers = [5, 10, 15, 20];
let total = 0;
numbers.forEach(nb => (total += nb));
```

- forEach is `impure`, because it does a _side effect_. It mutates `total` which is define outside the function.

- A better alternative is to use `reduce` provided by JavaScript that does not produce a side effect.

```js
const numbers = [5, 10, 15, 20];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

console.log(numbers.reduce(reducer));
```

### Reducer Pattern

- Instead of just using arrays, we can use actions that map to state transitions
- Uses a more _declarative_ state updates
- Allows to decouple how the state is updated from the action that triggered that update

- Reducer Pattern

### React useReducer Hook

- allows to manage the state using the `reducer pattern`

```js
const [state, dispatch] = useReducer(reducerFct, initialState);
```

- `state` -> contains the value of the current state
- `dispatch` -> dispatch function invokes the reducer function
- `reducerFct` -> how to update the state based on the type of action
- `initial state` -> set the initial value of the state

- [Demo: Github API Request - useReducer](https://codesandbox.io/s/usereducer-axios-request-nfyn3)

## WebSocket

### Limits of the HTTP Protocol

- Since we are in the browser, we have to use HTTP for communication

- HTTP wasn't designed for real-time, full-duplex communication

- There are two main issues with HTTP:

1. Server cannot initiate a request to the client

- Web applications were originally developed around a client/server model
- The Web client is always the initiator of transactions, requesting data from the server
- There was no mechanism for the server to independently send, or push, data to the client without the client first making a request.

2. HTTP requests are not persistent by nature. They are transactional.

- Client opens
- Request is made
- Server processes and sends a response
- Client closes

### Solutions Before WebSockets

- `polling` was one of the solution which consists of sending Ajax request every x amount of seconds for new data.

PRO: Almost Real time!

CON: this feels horrible, blasting the server with requests

- Unecessary requests inevitable and as a result, many connections are opened and closed needlessly in low-message-rate situations

### Benefits of WebSocket Compared to Other Solutions

- Supported natively in the browser
- Web Socket removes the overhead and dramatically reduces complexity compared to other solutions
- It's more scalable

### What is WebSocket

- HTTP is a protocol http://
- Websockets is a different one ws://

- Communication goes both ways (Full Duplex)
- The connections remain oponened and client and servers can communicate continuously
- It's Real Time
- Useful for web-based games, chatting applications, etc.
- Not a replacement for HTTP, it's an upgrade (Can't communicate with REST, OAuth)
