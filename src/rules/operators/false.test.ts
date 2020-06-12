import { RuleFalse } from './false';

describe('RuleFalse Tests', () => {
  test('Should return false', async () => {
    const rule = new RuleFalse();

    const result = await rule.resolve();

    expect(result).toEqual(false);
  });
});
