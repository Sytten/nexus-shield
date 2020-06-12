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
 * Wraps a function into a BaseRule class. This way we can identify rules
 * once we start generating middleware from our ruleTree.
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

type ShieldRuleConfig<TypeName extends string, FieldName extends string> = {
  name?: string;
  cache?: ShieldCache;
  resolve: ShieldRuleFunction<TypeName, FieldName>;
};

export const rule2 = <TypeName extends string, FieldName extends string>(
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
  return new RuleAnd(rules);
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
  return new RuleChain(rules);
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
  return new RuleRace(rules);
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
  return new RuleOr(rules);
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
  return new RuleNot(rule);
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
