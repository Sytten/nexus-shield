import { mock, MockProxy } from 'jest-mock-extended';
import { GraphQLResolveInfo } from 'graphql';

import { RuleAnd } from './and';
import { RuleTrue } from './true';
import { RuleFalse } from './false';

import { pluginOptions, RuleThrow } from '../../../tests/helpers';

describe('RuleAnd Tests', () => {
  let info: MockProxy<GraphQLResolveInfo>;

  beforeEach(() => {
    info = mock<GraphQLResolveInfo>();
  });

  test('Should return false if one rule returns false', async () => {
    const rule = new RuleAnd([new RuleTrue(), new RuleFalse()]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(false);
  });

  test('Should throw if one rule throws', async () => {
    const rule = new RuleAnd([new RuleTrue(), new RuleThrow()]);

    await expect(
      rule.resolve({}, {}, {}, info, pluginOptions)
    ).rejects.toThrowError();
  });

  test('Should throw first thrown error', async () => {
    const rule = new RuleAnd([new RuleThrow('first'), new RuleThrow('second')]);

    await expect(
      rule.resolve({}, {}, {}, info, pluginOptions)
    ).rejects.toThrowError('first');
  });

  test('Should return true all rules return true', async () => {
    const rule = new RuleAnd([new RuleTrue(), new RuleTrue()]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(true);
  });
});
