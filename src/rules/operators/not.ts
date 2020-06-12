import { GraphQLResolveInfo } from 'graphql';

import { ShieldRule, ShieldRuleResult, ShieldContext } from '../interface';
import { LogicRule } from '../logic';
import { ShieldPluginOptions } from '../../config';
import {
  TypeNameType,
  FieldNameType,
  RootValue,
  ArgsValue,
  GetGen,
} from '../../typing';

export class RuleNot<
  TypeName extends TypeNameType,
  FieldName extends FieldNameType
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
    root: RootValue<TypeName>,
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
