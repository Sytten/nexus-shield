import { GraphQLResolveInfo } from 'graphql';
import { mock, MockProxy } from 'jest-mock-extended';
import { mockFn } from 'jest-mock-extended/lib/Mock'; // FIXME: https://github.com/marchaos/jest-mock-extended/pull/42

import { pluginOptions } from '../../tests/helpers';
import { BaseRule } from './base';
import { ShieldCache, ShieldRuleFunction } from './interface';

describe('BaseRule Tests', () => {
  let info: MockProxy<GraphQLResolveInfo>;

  beforeEach(() => {
    info = mock<GraphQLResolveInfo>();
  });

  test('Resolve calls the provided func', async () => {
    const func = mockFn<ShieldRuleFunction<any, any>>().mockResolvedValue(true);
    const rule = new BaseRule({}, func);

    const result = await rule.resolve({}, {}, {}, info, pluginOptions);

    expect(result).toEqual(true);
    expect(func).toHaveBeenCalled();
  });

  test('Contextual caching should cache for the whole request', async () => {
    const func = mockFn<ShieldRuleFunction<any, any>>().mockResolvedValue(true);
    const rule = new BaseRule({ cache: ShieldCache.CONTEXTUAL }, func);

    const context = { _shield: { cache: {} } };
    const result = await rule.resolve({}, {}, context, info, pluginOptions);
    const result2 = await rule.resolve({}, {}, context, info, pluginOptions);

    expect(result).toEqual(true);
    expect(result2).toEqual(true);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('Strict caching should cache if same root and args', async () => {
    const func = mockFn<ShieldRuleFunction<any, any>>().mockResolvedValue(true);
    const rule = new BaseRule({ cache: ShieldCache.STRICT }, func);

    const context = { _shield: { cache: {} } };
    const result = await rule.resolve({}, {}, context, info, pluginOptions);
    const result2 = await rule.resolve({}, {}, context, info, pluginOptions);

    expect(result).toEqual(true);
    expect(result2).toEqual(true);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('Strict caching should not cache if different root', async () => {
    const func = mockFn<ShieldRuleFunction<any, any>>().mockResolvedValue(true);
    const rule = new BaseRule({ cache: ShieldCache.STRICT }, func);

    const context = { _shield: { cache: {} } };
    const result = await rule.resolve(
      { a: 1 },
      {},
      context,
      info,
      pluginOptions
    );
    const result2 = await rule.resolve(
      { a: 2 },
      {},
      context,
      info,
      pluginOptions
    );

    expect(result).toEqual(true);
    expect(result2).toEqual(true);
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('Strict caching should not cache if different args', async () => {
    const func = mockFn<ShieldRuleFunction<any, any>>().mockResolvedValue(true);
    const rule = new BaseRule({ cache: ShieldCache.STRICT }, func);

    const context = { _shield: { cache: {} } };
    const result = await rule.resolve(
      {},
      { a: 1 },
      context,
      info,
      pluginOptions
    );
    const result2 = await rule.resolve(
      {},
      { a: 2 },
      context,
      info,
      pluginOptions
    );

    expect(result).toEqual(true);
    expect(result2).toEqual(true);
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('Caching can be shared if reusing same name', async () => {
    const func = mockFn<ShieldRuleFunction<any, any>>().mockResolvedValue(true);
    const rule = new BaseRule(
      { name: 'key', cache: ShieldCache.CONTEXTUAL },
      func
    );
    const rule2 = new BaseRule(
      { name: 'key', cache: ShieldCache.CONTEXTUAL },
      func
    );

    const context = { _shield: { cache: {} } };
    const result = await rule.resolve({}, {}, context, info, pluginOptions);
    const result2 = await rule2.resolve({}, {}, context, info, pluginOptions);

    expect(result).toEqual(true);
    expect(result2).toEqual(true);
    expect(func).toHaveBeenCalledTimes(1);
  });
});
