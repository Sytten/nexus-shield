import { ShieldRuleResult } from '../interface';
import { LogicRule } from '../logic';

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
