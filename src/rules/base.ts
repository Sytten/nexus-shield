import { GraphQLResolveInfo } from 'graphql';

import {
  ShieldRule,
  ShieldContext,
  ShieldRuleResult,
  ShieldRuleFunction,
  ShieldCache,
  ShieldRuleOptions,
} from './interface';
import { ShieldPluginOptions } from '../config';
import {
  TypeNameType,
  FieldNameType,
  RootValue,
  ArgsValue,
  GetGen,
} from '../typing';

export class BaseRule<
  TypeName extends TypeNameType,
  FieldName extends FieldNameType
> implements ShieldRule<TypeName, FieldName> {
  readonly name: string;

  private cache: ShieldCache;
  private func: ShieldRuleFunction<TypeName, FieldName>;

  constructor(
    options: ShieldRuleOptions,
    func: ShieldRuleFunction<TypeName, FieldName>
  ) {
    this.name = options.name || Math.random().toString();
    this.cache = options.cache || ShieldCache.NO_CACHE;
    this.func = func;
  }

  async resolve(
    root: RootValue<TypeName>,
    args: ArgsValue<TypeName, FieldName>,
    ctx: GetGen<'context'> & ShieldContext,
    info: GraphQLResolveInfo,
    options: ShieldPluginOptions
  ): Promise<ShieldRuleResult> {
    switch (this.cache) {
      case ShieldCache.STRICT: {
        const key = options.hashFunction({ root, args });
        return this.cacheable(`${this.name}-${key}`)(root, args, ctx, info);
      }
      case ShieldCache.CONTEXTUAL: {
        return this.cacheable(this.name)(root, args, ctx, info);
      }
      case ShieldCache.NO_CACHE: {
        return this.func(root, args, ctx, info);
      }
    }
  }

  /**
   * Writes or reads result from cache.
   *
   * @param key
   */
  private cacheable(
    key: string
  ): (
    root: RootValue<TypeName>,
    args: ArgsValue<TypeName, FieldName>,
    ctx: GetGen<'context'> & ShieldContext,
    info: GraphQLResolveInfo
  ) => ShieldRuleResult | Promise<ShieldRuleResult> {
    return (root, args, ctx, info) => {
      if (!ctx._shield.cache[key]) {
        ctx._shield.cache[key] = this.func(root, args, ctx, info);
      }
      return ctx._shield.cache[key];
    };
  }
}
