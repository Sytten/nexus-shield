import {
  allow,
  and,
  chain,
  deny,
  not,
  or,
  race,
  rule,
  ruleType,
} from './builders';
import { isShieldRule } from './utils';

describe('Utils Tests', () => {
  describe('isShieldRule Tests', () => {
    const baseRule = rule()(() => true);
    const baseRuleType = ruleType({ resolve: () => true });

    test.each([baseRule, baseRuleType, allow, deny])(
      'Can detect rule %#',
      (subject) => {
        const result = isShieldRule(subject);

        expect(result).toEqual(true);
      }
    );

    test.each([and, chain, or, race, not])(
      'Can detect operator %#',
      (operator) => {
        const subject = operator(rule()(() => true));

        const result = isShieldRule(subject);

        expect(result).toEqual(true);
      }
    );
  });
});
