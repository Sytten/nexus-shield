import { GraphQLResolveInfo } from 'graphql';
import {
  RootValue,
  ArgsValue,
  GetGen,
} from '@nexus/schema/dist/typegenTypeHelpers';

import { ShieldRule, ShieldRuleResult, ShieldContext } from '../interface';
import { LogicRule } from '../logic';
import { ShieldPluginOptions } from '../../config';

export class RuleChain<
  TypeName extends string,
  FieldName extends string
> extends LogicRule<TypeName, FieldName> {
  constructor(rules: ShieldRule<TypeName, FieldName>[]) {
    super(rules);
  }

  /**
   * Makes sure that all of them have resolved to true.
   */
  async resolve(
    root: RootValue<TypeName>,
    args: ArgsValue<TypeName, FieldName>,
    ctx: GetGen<'context'> & ShieldContext,
    info: GraphQLResolveInfo,
    options: ShieldPluginOptions
  ): Promise<ShieldRuleResult> {
    const result = await this.evaluate(root, args, ctx, info, options);

    for (const res of result) {
      if (res.status === 'rejected') {
        throw res.reason;
      } else if (res.value === false) {
        return false;
      }
    }

    return true;
  }

  /**
   * Evaluates all the rules.
   */
  async evaluate(
    root: RootValue<TypeName>,
    args: ArgsValue<TypeName, FieldName>,
    ctx: GetGen<'context'> & ShieldContext,
    info: GraphQLResolveInfo,
    options: ShieldPluginOptions
  ): Promise<PromiseSettledResult<ShieldRuleResult>[]> {
    return iterate(this.rules);

    async function iterate([rule, ...otherRules]: ShieldRule<
      TypeName,
      FieldName
    >[]): Promise<PromiseSettledResult<ShieldRuleResult>[]> {
      if (rule === undefined) return [];
      return rule.resolve(root, args, ctx, info, options).then((res) => {
        if (res !== true) return [{ status: 'fulfilled', value: res }];
        return iterate(otherRules).then((ress) =>
          ress.concat([{ status: 'fulfilled', value: res }])
        );
      });
    }
  }
}
