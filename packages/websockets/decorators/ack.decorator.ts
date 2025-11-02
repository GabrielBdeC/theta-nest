import { WsParamtype } from '../enums/ws-paramtype.enum';
import { createWsParamDecorator } from '../utils/param.utils';

/**
 * WebSocket acknowledgement callback parameter decorator.
 * Injects the Socket.IO acknowledgement callback function into the handler.
 *
 * When this decorator is used, automatic acknowledgement is disabled,
 * giving the developer full control over when and what to send as the ack response.
 *
 * Example:
 * ```typescript
 * @SubscribeMessage('update-item')
 * handleUpdate(
 *   @MessageBody() data: any,
 *   @Ack() ack: (response: any) => void,
 * ) {
 *   // Manual control over acknowledgement
 *   ack({ status: 'ok', data });
 * }
 * ```
 *
 * @publicApi
 */
export const Ack: () => ParameterDecorator = createWsParamDecorator(
  WsParamtype.ACK,
);
