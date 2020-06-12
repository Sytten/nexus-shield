import { mock, MockProxy } from 'jest-mock-extended';
import { GraphQLResolveInfo } from 'graphql';

import { RuleNot } from './not';
import { RuleTrue } from './true';
import { RuleFalse } from './false';

import { pluginOptions, RuleThrow } from '../../../tests/helpers';

describe('RuleNot Tests', () => {
  let info: MockProxy<GraphQLResolveInfo>;

  beforeEach(() => {
    info = mock<GraphQLResolveInfo>();
  });

  test('Should return false if the rule returns true', async () => {
    const rule = new RuleNot(new RuleTrue());

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(false);
  });

  test('Should return true if the rule returns false', async () => {
    const rule = new RuleNot(new RuleFalse());

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(true);
  });

  test('Should throw if the rule throws', async () => {
    const rule = new RuleNot(new RuleThrow());

    await expect(
      rule.resolve({}, {}, {}, info, pluginOptions)
    ).rejects.toThrowError();
  });
});
