import {
  FullShieldRule,
  BaseRule,
  ShieldRuleOptions,
  ShieldRuleFunction,
  RuleTrue,
  RuleFalse,
  ShieldCache,
  RuleAnd,
  RuleChain,
  RuleNot,
  RuleOr,
  RuleRace,
  ShieldRule,
} from './rules';
import { GenericShieldRule, PartialShieldRule } from './rules';

/**
 *
 * @param options
 *
 * Wraps a function into a BaseRule class.
 *
 * 1.
 * const auth = rule()(async (parent, args, ctx, info) => {
 *  return true
 * })
 *
 * 2.
 * const auth = rule({
 *  name: 'name',
 *  cache: ShieldCache.NO_CACHE,
 * })(async (parent, args, ctx, info) => {
 *  return true
 * })
 *
 */
export const rule = <
  TypeName extends string = any,
  FieldName extends string = any
>(
  options?: ShieldRuleOptions
) => (
  func: ShieldRuleFunction<TypeName, FieldName>
): FullShieldRule<TypeName, FieldName> => {
  options = options || {};
  return new BaseRule<TypeName, FieldName>(options, func);
};

export const partialRule = <TypeName extends string>(
  options?: ShieldRuleOptions
) => (func: ShieldRuleFunction<TypeName, any>): PartialShieldRule<TypeName> => {
  options = options || {};
  return new BaseRule<TypeName, any>(options, func);
};

export const genericRule = (options?: ShieldRuleOptions) => (
  func: ShieldRuleFunction<any, any>
): GenericShieldRule => {
  options = options || {};
  return new BaseRule<any, any>(options, func);
};

/**
 *
 * @param config
 *
 * Wraps a function into a BaseRule class.
 *
 * 1.
 * const auth = rule()(async (parent, args, ctx, info) => {
 *  return true
 * })
 *
 * 2.
 * const auth = rule({
 *  name: 'name',
 *  cache: ShieldCache.NO_CACHE,
 * })(async (parent, args, ctx, info) => {
 *  return true
 * })
 *
 */

type ShieldRuleConfig<TypeName extends string, FieldName extends string> = {
  name?: string;
  cache?: ShieldCache;
  resolve: ShieldRuleFunction<TypeName, FieldName>;
};

export const ruleType = <
  TypeName extends string = any,
  FieldName extends string = any
>(
  config: ShieldRuleConfig<TypeName, FieldName>
): FullShieldRule<TypeName, FieldName> => {
  return new BaseRule<TypeName, FieldName>(config, config.resolve);
};

export const partialRuleType = <TypeName extends string = any>(
  config: ShieldRuleConfig<TypeName, any> & { type: TypeName }
): PartialShieldRule<TypeName> => {
  return new BaseRule<TypeName, any>(config, config.resolve);
};

export const genericRuleType = (
  config: ShieldRuleConfig<any, any>
): GenericShieldRule => {
  return new BaseRule<any, any>(config, config.resolve);
};

/**
 *
 * @param rules
 *
 * Logical operator and serves as a wrapper for the and operation.
 *
 */
export const and = <TypeName extends string, FieldName extends string>(
  ...rules: ShieldRule<TypeName, FieldName>[]
): FullShieldRule<TypeName, FieldName> => {
  return new RuleAnd<TypeName, FieldName>(rules);
};

/**
 *
 * @param rules
 *
 * Logical operator and serves as a wrapper for the chain operation.
 *
 */
export const chain = <TypeName extends string, FieldName extends string>(
  ...rules: ShieldRule<TypeName, FieldName>[]
): FullShieldRule<TypeName, FieldName> => {
  return new RuleChain<TypeName, FieldName>(rules);
};

/**
 *
 * @param rules
 *
 * Logical operator and serves as a wrapper for the race operation.
 *
 */
export const race = <TypeName extends string, FieldName extends string>(
  ...rules: ShieldRule<TypeName, FieldName>[]
): FullShieldRule<TypeName, FieldName> => {
  return new RuleRace<TypeName, FieldName>(rules);
};

/**
 *
 * @param rules
 *
 * Logical operator or serves as a wrapper for the or operation.
 *
 */
export const or = <TypeName extends string, FieldName extends string>(
  ...rules: ShieldRule<TypeName, FieldName>[]
): FullShieldRule<TypeName, FieldName> => {
  return new RuleOr<TypeName, FieldName>(rules);
};

/**
 *
 * @param rule
 *
 * Logical operator not serves as a wrapper for the not operation.
 *
 */
export const not = <TypeName extends string, FieldName extends string>(
  rule: ShieldRule<TypeName, FieldName>
): FullShieldRule<TypeName, FieldName> => {
  return new RuleNot<TypeName, FieldName>(rule);
};

/**
 *
 * Allow queries.
 *
 */
export const allow: GenericShieldRule = new RuleTrue();

/**
 *
 * Deny queries.
 *
 */
export const deny: GenericShieldRule = new RuleFalse();
