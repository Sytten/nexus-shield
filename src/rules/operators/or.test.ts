import { GraphQLResolveInfo } from 'graphql';
import { mock, MockProxy } from 'jest-mock-extended';

import { pluginOptions, RuleThrow } from '../../../tests/helpers';
import { RuleFalse } from './false';
import { RuleOr } from './or';
import { RuleTrue } from './true';

describe('RuleOr Tests', () => {
  let info: MockProxy<GraphQLResolveInfo>;

  beforeEach(() => {
    info = mock<GraphQLResolveInfo>();
  });

  test('Should return false if all rules returns false', async () => {
    const rule = new RuleOr([new RuleFalse(), new RuleFalse()]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(false);
  });

  test('Should not throw if one rule throws, but one rule returns true', async () => {
    const rule = new RuleOr([new RuleTrue(), new RuleThrow()]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(true);
  });

  test('Should throw first thrown error if all rules throw or return false', async () => {
    const rule = new RuleOr([
      new RuleThrow('first'),
      new RuleThrow('second'),
      new RuleFalse(),
    ]);

    await expect(
      rule.resolve({}, {}, {}, info, pluginOptions)
    ).rejects.toThrowError('first');
  });

  test('Should return true one rule returns true', async () => {
    const rule = new RuleOr([new RuleTrue(), new RuleFalse()]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(true);
  });
});
