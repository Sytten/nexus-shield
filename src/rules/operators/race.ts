import { GraphQLResolveInfo } from 'graphql';
import { RootValue, ArgsValue, GetGen } from '@nexus/schema/dist/core';

import { ShieldRule, ShieldRuleResult, ShieldContext } from '../interface';
import { LogicRule } from '../logic';
import { ShieldPluginOptions } from '../../config';

export class RuleRace<
  TypeName extends string,
  FieldName extends string
> extends LogicRule<TypeName, FieldName> {
  constructor(rules: ShieldRule<TypeName, FieldName>[]) {
    super(rules);
  }

  /**
   * Makes sure that at least one of them resolved to true.
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
        error = res.reason;
      } else if (res.value === true) {
        return true;
      }
    }

    if (error) throw error;
    return false;
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
      return rule.resolve(root, args, ctx, info, options).then(
        (res) => {
          if (res === true) return [{ status: 'fulfilled', value: res }];
          return iterate(otherRules).then((ress) =>
            ress.concat([{ status: 'fulfilled', value: res }])
          );
        },
        (err) => {
          return iterate(otherRules).then((ress) =>
            ress.concat([{ status: 'rejected', reason: err }])
          );
        }
      );
    }
  }
}
