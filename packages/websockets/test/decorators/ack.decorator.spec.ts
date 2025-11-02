import { expect } from 'chai';
import { PARAM_ARGS_METADATA } from '../../constants';
import { Ack } from '../../decorators';
import { WsParamtype } from '../../enums/ws-paramtype.enum';

class AckTest {
  public test(@Ack() ack: any) {}
}

describe('@Ack', () => {
  it('should enhance class with expected ack metadata', () => {
    const argsMetadata = Reflect.getMetadata(
      PARAM_ARGS_METADATA,
      AckTest,
      'test',
    );
    const expectedMetadata = {
      [`${WsParamtype.ACK}:0`]: {
        data: undefined,
        index: 0,
        pipes: [],
      },
    };
    expect(argsMetadata).to.be.eql(expectedMetadata);
  });
});
