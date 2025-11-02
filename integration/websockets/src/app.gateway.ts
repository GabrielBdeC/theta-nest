import { UseFilters, UseInterceptors } from '@nestjs/common';
import {
  Ack,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { RequestInterceptor } from './request.interceptor';
import { throwError } from 'rxjs';
import { RequestFilter } from './request.filter';

@WebSocketGateway(8080)
export class ApplicationGateway {
  @SubscribeMessage('push')
  onPush(@MessageBody() data) {
    return {
      event: 'pop',
      data,
    };
  }

  @UseInterceptors(RequestInterceptor)
  @SubscribeMessage('getClient')
  getPathCalled(client, data) {
    return {
      event: 'popClient',
      data: { ...data, path: client.pattern },
    };
  }

  @UseFilters(RequestFilter)
  @SubscribeMessage('getClientWithError')
  getPathCalledWithError() {
    return throwError(() => new WsException('This is an error'));
  }

  @SubscribeMessage('manualAck')
  onManualAck(@MessageBody() data, @Ack() ack: (response: any) => void) {
    // Manual acknowledgement - no return value sent
    ack({ status: 'manual', data });
  }

  @SubscribeMessage('asyncManualAck')
  async onAsyncManualAck(
    @MessageBody() data,
    @Ack() ack: (response: any) => void,
  ) {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10));
    ack({ status: 'async', data });
  }

  @SubscribeMessage('implicitAck')
  onImplicitAck(@MessageBody() data) {
    // Implicit acknowledgement - return value is sent
    return { status: 'implicit', data };
  }
}
