import { GraphQLResolveInfo } from 'graphql';
import { RootValue, ArgsValue, GetGen } from '@nexus/schema/dist/core';

import { ShieldRule, ShieldRuleResult, ShieldContext } from '../interface';
import { LogicRule } from '../logic';
import { ShieldPluginOptions } from '../../config';

export class RuleOr<
  TypeName extends string,
  FieldName extends string
> extends LogicRule<TypeName, FieldName> {
  constructor(rules: ShieldRule<TypeName, FieldName>[]) {
    super(rules);
  }

  /**
   * Makes sure that at least one of them has evaluated to true.
   */
  async resolve(
    root: RootValue<TypeName>,
    args: ArgsValue<TypeName, FieldName>,
    ctx: GetGen<'context'> & ShieldContext,
    info: GraphQLResolveInfo,
    options: ShieldPluginOptions
  ): Promise<ShieldRuleResult> {
    const result = await this.evaluate(root, args, ctx, info, options);

    let error: object | undefined;
    for (const res of result) {
      if (res.status === 'rejected') {
        error = error || res.reason;
      } else if (res.value === true) {
        return true;
      }
    }

    if (error) throw error;
    return false;
  }
}
