import { RuleTrue } from './true';

describe('RuleTrue Tests', () => {
  test('Should return true', async () => {
    const rule = new RuleTrue();

    const result = await rule.resolve();

    expect(result).toEqual(true);
  });
});
