import { GraphQLResolveInfo } from 'graphql';
import { mock, MockProxy } from 'jest-mock-extended';

import { pluginOptions, RuleThrow } from '../../../tests/helpers';
import { ShieldRule } from '../interface';
import { RuleFalse } from './false';
import { RuleRace } from './race';
import { RuleTrue } from './true';

describe('RuleRace Tests', () => {
  let info: MockProxy<GraphQLResolveInfo>;

  beforeEach(() => {
    info = mock<GraphQLResolveInfo>();
  });

  test('Should return false if all rules return false', async () => {
    const rule = new RuleRace([new RuleFalse(), new RuleFalse()]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(false);
  });

  test('Should return true if one rule returns true', async () => {
    const rule = new RuleRace([new RuleFalse(), new RuleTrue()]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(true);
  });

  test('Should not execute subsequent rules if one rule returns true', async () => {
    const mockRule = mock<ShieldRule<any, any>>();
    const rule = new RuleRace([new RuleTrue(), mockRule]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(true);
    expect(mockRule.resolve).not.toHaveBeenCalled();
  });

  test('Should throw first thrown error if all rules throw or return false', async () => {
    const rule = new RuleRace([
      new RuleThrow('first'),
      new RuleThrow('second'),
      new RuleFalse(),
    ]);

    await expect(
      rule.resolve({}, {}, {}, info, pluginOptions)
    ).rejects.toThrowError('first');
  });

  test('Should not throw if one rule throws, but one rule returns true', async () => {
    const rule = new RuleRace([new RuleThrow(), new RuleTrue()]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(true);
  });
});
