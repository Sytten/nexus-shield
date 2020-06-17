import { GraphQLResolveInfo } from 'graphql';
import { MockProxy, mock } from 'jest-mock-extended';

import { ShieldRule } from './interface';
import { LogicRule } from './logic';

import { pluginOptions } from '../../tests/helpers';

describe('LogicRule Tests', () => {
  let info: MockProxy<GraphQLResolveInfo>;

  beforeEach(() => {
    info = mock<GraphQLResolveInfo>();
  });

  test('Resolve returns false', async () => {
    const rule = new LogicRule([]);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(false);
  });

  test('Evaluate executes all rules', async () => {
    const childRule = mock<ShieldRule<any, any>>();
    childRule.resolve.mockResolvedValue(true);
    const childRule2 = mock<ShieldRule<any, any>>();
    childRule2.resolve.mockResolvedValue(false);

    const rule = new LogicRule([childRule, childRule2]);

    const result = await rule.evaluate({}, {}, {}, info, pluginOptions);

    expect(result).toEqual([
      { status: 'fulfilled', value: true },
      { status: 'fulfilled', value: false },
    ]);
  });

  test('Evaluate does not throw even if a rule is rejected', async () => {
    const childRule = mock<ShieldRule<any, any>>();
    childRule.resolve.mockResolvedValue(true);
    const childRule2 = mock<ShieldRule<any, any>>();
    childRule2.resolve.mockRejectedValue('reason');

    const rule = new LogicRule([childRule, childRule2]);

    const result = await rule.evaluate({}, {}, {}, info, pluginOptions);

    expect(result).toEqual([
      { status: 'fulfilled', value: true },
      { status: 'rejected', reason: 'reason' },
    ]);
  });
});
