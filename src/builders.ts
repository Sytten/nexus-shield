import {
  ShieldRule,
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
} from './rules';

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
export const rule = (options?: ShieldRuleOptions) => <
  TypeName extends string,
  FieldName extends string
>(
  func: ShieldRuleFunction<TypeName, FieldName>
): ShieldRule<TypeName, FieldName> => {
  options = options || {};
  return new BaseRule<TypeName, FieldName>(options, func);
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
  type?: TypeName;
  name?: string;
  cache?: ShieldCache;
  resolve: ShieldRuleFunction<TypeName, FieldName>;
};

export const ruleType = <TypeName extends string, FieldName extends string>(
  config: ShieldRuleConfig<TypeName, FieldName>
): ShieldRule<TypeName, FieldName> => {
  return new BaseRule<TypeName, FieldName>(config, config.resolve);
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
): ShieldRule<TypeName, FieldName> => {
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
): ShieldRule<TypeName, FieldName> => {
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
): ShieldRule<TypeName, FieldName> => {
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
): ShieldRule<TypeName, FieldName> => {
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
): ShieldRule<TypeName, FieldName> => {
  return new RuleNot<TypeName, FieldName>(rule);
};

/**
 *
 * Allow queries.
 *
 */
export const allow = new RuleTrue();

/**
 *
 * Deny queries.
 *
 */
export const deny = new RuleFalse();

/**
 *
 * Helper for generic rules
 *
 */
export const generic = (rule: ShieldRule<any, any>) => <
  TypeName extends string,
  FieldName extends string
>(): ShieldRule<TypeName, FieldName> => rule;

/**
 *
 * Helper for partial rules
 *
 */
export const partial = <TypeName extends string>(
  rule: ShieldRule<TypeName, any>
) => <
  T extends TypeName, // NOTE: It would be best to do something with this type
  FieldName extends string
>(): ShieldRule<TypeName, FieldName> => rule;
