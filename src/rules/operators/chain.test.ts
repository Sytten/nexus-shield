import { GraphQLResolveInfo } from 'graphql';
import { mock, MockProxy } from 'jest-mock-extended';

import { pluginOptions, RuleThrow } from '../../../tests/helpers';
import { ShieldRule } from '../interface';
import { RuleChain } from './chain';
import { RuleFalse } from './false';
import { RuleTrue } from './true';

describe('RuleChain Tests', () => {
  let info: MockProxy<GraphQLResolveInfo>;

  beforeEach(() => {
    info = mock<GraphQLResolveInfo>();
  });

  test('Should return false if one rule returns false', async () => {
    const rule = new RuleChain([new RuleTrue(), new RuleFalse()]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(false);
  });

  test('Should throw if one rule throws', async () => {
    const rule = new RuleChain([new RuleTrue(), new RuleThrow()]);

    await expect(
      rule.resolve({}, {}, {}, info, pluginOptions)
    ).rejects.toThrowError();
  });

  test('Should throw first thrown error', async () => {
    const rule = new RuleChain([
      new RuleThrow('first'),
      new RuleThrow('second'),
    ]);

    await expect(
      rule.resolve({}, {}, {}, info, pluginOptions)
    ).rejects.toThrowError('first');
  });

  test('Should not execute subsequent rules if one rule returns false', async () => {
    const mockRule = mock<ShieldRule<any, any>>();
    const rule = new RuleChain([new RuleFalse(), mockRule]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(false);
    expect(mockRule.resolve).not.toHaveBeenCalled();
  });

  test('Should return true if all rules return true', async () => {
    const rule = new RuleChain([new RuleTrue(), new RuleTrue()]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(true);
  });
});
