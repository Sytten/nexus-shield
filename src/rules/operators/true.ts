import { LogicRule } from '../logic';
import { ShieldRuleResult } from '../interface';

export class RuleTrue extends LogicRule<any, any> {
  constructor() {
    super([]);
  }

  /**
   *
   * Always true.
   *
   */
  async resolve(): Promise<ShieldRuleResult> {
    return true;
  }
}
