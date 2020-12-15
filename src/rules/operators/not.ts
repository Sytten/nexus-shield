import { GraphQLResolveInfo } from 'graphql';
import { ArgsValue, GetGen, SourceValue } from 'nexus/dist/core';

import { ShieldPluginOptions } from '../../config';
import { ShieldContext, ShieldRule, ShieldRuleResult } from '../interface';
import { LogicRule } from '../logic';

export class RuleNot<
  TypeName extends string,
  FieldName extends string
> extends LogicRule<TypeName, FieldName> {
  constructor(rule: ShieldRule<TypeName, FieldName>) {
    super([rule]);
  }

  /**
   *
   * @param parent
   * @param args
   * @param ctx
   * @param info
   *
   * Negates the result.
   *
   */
  async resolve(
    root: SourceValue<TypeName>,
    args: ArgsValue<TypeName, FieldName>,
    ctx: GetGen<'context'> & ShieldContext,
    info: GraphQLResolveInfo,
    options: ShieldPluginOptions
  ): Promise<ShieldRuleResult> {
    const [res] = await this.evaluate(root, args, ctx, info, options);

    if (res.status === 'rejected') {
      throw res.reason;
    } else {
      return !res.value;
    }
  }
}
