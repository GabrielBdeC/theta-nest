import { expect } from 'chai';
import { spawnSync } from 'child_process';
import { join } from 'path';

describe('enableShutdownHooks', () => {
  it('should ignore system signals which are not specified', done => {
    const result = spawnSync('ts-node', [
      join(__dirname, '../src/enable-shutdown-hooks-main.ts'),
      'SIGINT',
      'SIGHUP',
    ]);
    expect(result.stdout.toString().trim()).to.be.eq('');
    done();
  }).timeout(10000);

  it('should ignore system signals if "enableShutdownHooks" was not called', done => {
    const result = spawnSync('ts-node', [
      join(__dirname, '../src/enable-shutdown-hooks-main.ts'),
      'SIGINT',
      'NONE',
    ]);
    expect(result.stdout.toString().trim()).to.be.eq('');
    done();
  }).timeout(10000);
});
