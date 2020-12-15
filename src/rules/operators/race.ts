import { GraphQLResolveInfo } from 'graphql';
import { ArgsValue, GetGen, SourceValue } from 'nexus/dist/core';

import { ShieldPluginOptions } from '../../config';
import { ShieldContext, ShieldRule, ShieldRuleResult } from '../interface';
import { LogicRule } from '../logic';

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
    root: SourceValue<TypeName>,
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

  /**
   * Evaluates all the rules.
   */
  async evaluate(
    root: SourceValue<TypeName>,
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
          return iterate(otherRules).then((ress) => [
            { status: 'fulfilled', value: res },
            ...ress,
          ]);
        },
        (err) => {
          return iterate(otherRules).then((ress) => [
            { status: 'rejected', reason: err },
            ...ress,
          ]);
        }
      );
    }
  }
}
