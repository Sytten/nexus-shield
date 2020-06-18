import { ShieldRuleResult } from '../interface';
import { LogicRule } from '../logic';

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
