import { GraphQLResolveInfo } from 'graphql';
import { RootValue, ArgsValue, GetGen } from '@nexus/schema/dist/core';

import { ShieldPluginOptions } from '../config';

export type ShieldRuleResult = boolean;

// Context
export type ShieldContext = {
  _shield: {
    cache: { [key: string]: ShieldRuleResult | Promise<ShieldRuleResult> };
  };
};

// Cache
export const enum ShieldCache {
  STRICT = 'strict',
  CONTEXTUAL = 'contextual',
  NO_CACHE = 'no_cache',
}

// Rule
export interface ShieldRuleOptions {
  name?: string;
  cache?: ShieldCache;
}

export interface ShieldRule<TypeName extends string, FieldName extends string> {
  resolve(
    root: RootValue<TypeName>,
    args: ArgsValue<TypeName, FieldName>,
    ctx: GetGen<'context'> & ShieldContext,
    info: GraphQLResolveInfo,
    options: ShieldPluginOptions
  ): Promise<ShieldRuleResult>;
}

// Rule fonction
export type ShieldRuleFunction<
  TypeName extends string,
  FieldName extends string
> = (
  root: RootValue<TypeName>,
  args: ArgsValue<TypeName, FieldName>,
  ctx: GetGen<'context'>,
  info: GraphQLResolveInfo
) => ShieldRuleResult | Promise<ShieldRuleResult>;
