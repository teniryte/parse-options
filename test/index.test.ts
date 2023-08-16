import * as chai from 'chai';

const x = chai.expect;

describe('test', () => {
  it('asserts 1 to 1', async () => {
    x(1).to.equal(1);
  });
});
