import * as hash from 'object-hash';

import { allow } from '../src/builders';
import { ShieldPluginOptions } from '../src/config';
import { LogicRule, ShieldRuleResult } from '../src/rules';

export const pluginOptions: ShieldPluginOptions = {
  defaultRule: allow,
  defaultError: new Error('default'),
  hashFunction: hash,
};

export class RuleThrow extends LogicRule<any, any> {
  constructor(private message?: string) {
    super([]);
  }
  async resolve(): Promise<ShieldRuleResult> {
    throw new Error(this.message || 'rule');
  }
}
