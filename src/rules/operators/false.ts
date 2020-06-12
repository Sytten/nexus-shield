import { LogicRule } from '../logic';
import { ShieldRuleResult } from '../interface';

export class RuleFalse extends LogicRule<any, any> {
  constructor() {
    super([]);
  }

  /**
   *
   * Always false.
   *
   */
  async resolve(): Promise<ShieldRuleResult> {
    return false;
  }
}
