import { BaseRule, ShieldRule } from './rules';

/**
 *
 * @param x
 *
 * Makes sure that a certain field is a shield rule.
 *
 */
export const isShieldRule = (x: any): x is ShieldRule<any, any> => {
  return (
    x instanceof BaseRule ||
    (x &&
      x.constructor &&
      (x.constructor.name === 'BaseRule' ||
        x.constructor.name === 'RuleAnd' ||
        x.constructor.name === 'RuleChain' ||
        x.constructor.name === 'RuleFalse' ||
        x.constructor.name === 'RuleNot' ||
        x.constructor.name === 'RuleOr' ||
        x.constructor.name === 'RuleRace' ||
        x.constructor.name === 'RuleTrue'))
  );
};
