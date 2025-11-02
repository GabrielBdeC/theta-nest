## 1. Context

NestJS currently supports implicit Socket.IO acknowledgements: when a `@SubscribeMessage()` handler returns a value, NestJS automatically sends it as the ack response to the client.

However, many real-world use cases require **manual control** of the acknowledgment callback. Examples:

- Waiting for an async process (database, external API) before sending ack
- Returning success or error depending on business logic
- Avoiding accidental double acknowledgements
- Sending multiple partial responses or structured payloads

Issue **#15286** reports that the ack callback provided by the Socket.IO client (`emit(event, payload, ack)`) is **not available in NestJS handlers**, making manual acking impossible. Currently, only the payload and socket instance are passed.

You need to introduce a solution: a new `@Ack()` decorator that enables explicit ack handling, without removing or breaking the existing implicit behavior.

---

## 2. Problem Statement

Developers must be able to access and execute the ack callback inside a NestJS WebSocket gateway method when desired.

Expected behavior:

1. When the client includes an ack callback in `emit`, the handler should receive it if declared via `@Ack()`.
2. If `@Ack()` is present, **automatic acking must be disabled** for that handler.
3. If `@Ack()` is not present, the current implicit behavior must continue unchanged.
4. No breaking changes. Old handlers should still work without modification.
5. The developer has full control over *whether*, *when*, and *what* is sent as the acknowledgement.

---

## 3. Prompt Specification

```
You are implementing a new feature for NestJS WebSockets that enables explicit Socket.IO ack handling.

### Goal
Provide a way for developers to manually access and invoke the Socket.IO ack callback through a new parameter decorator, while keeping full backward compatibility.

### Requirements

1. **New Decorator**
   - Create `@Ack()` to inject the raw ack callback into a `@SubscribeMessage()` handler.
   - Works the same way as `@MessageBody()` and `@ConnectedSocket()`.

2. **Manual Ack Mode**
   - If `@Ack()` is used, the framework must not auto-send an ack based on handler return value.
   - Developer becomes fully responsible for calling the callback.

3. **Example Usage**
   ```
   @SubscribeMessage('update-item')
   handleUpdate(
     @MessageBody() data: any,
     @Ack() ack: (response: any) => void,
   ) {
     // full manual control
     ack({ status: 'ok' })
   }
   ```

4. **Backward Compatibility**
   - If no `@Ack()` is present, returning a value still triggers automatic ack as before.
   - No breaking changes to any existing gateway.

5. **Internal Requirements**
   - Add a new `WsParamtype.ACK`
   - Handlers must be marked with a `isAckHandledManually` flag when `@Ack()` is used
   - Socket.IO adapter must skip implicit ack if this flag is set
   - Tests required for:
     - implicit ack (existing behavior)
     - explicit ack
     - async ack
     - prevention of double ack

6. **Out of Scope**
   - No changes required for transports other than `@nestjs/platform-socket.io`
   - No changes to message routing or payload parsing

### Acceptance Criteria
- Handler receives ack callback when `@Ack()` is included
- Implicit ack still works when decorator is not present
- No double-send occurs
- Existing applications continue working normally
```
