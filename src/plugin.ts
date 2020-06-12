import * as hash from 'object-hash';
import { plugin } from '@nexus/schema';
import {
  printedGenTypingImport,
  printedGenTyping,
} from '@nexus/schema/dist/utils';

import { ShieldRule, ShieldContext } from './rules';
import { ShieldPluginSettings } from './config';
import { isShieldRule } from './utils';
import { allow } from './builders';

const FieldShieldImport = printedGenTypingImport({
  module: 'nexus-shield',
  bindings: ['FieldShieldResolver'],
});

const FieldShieldType = printedGenTyping({
  optional: true,
  name: 'shield',
  description: `
    Rule to execute
  `,
  type: 'FieldShieldResolver<TypeName, FieldName>',
  imports: [FieldShieldImport],
});

export type FieldShieldResolver<
  TypeName extends string,
  FieldName extends string
> = ShieldRule<TypeName, FieldName>;

export const nexusShield = (settings: ShieldPluginSettings) => {
  const options = {
    defaultRule: settings.defaultRule || allow,
    defaultError: settings.defaultError || new Error('Not Authorised!'),
    hashFunction: settings.hashFunction || hash,
  };

  return plugin({
    name: 'Nexus Shield Plugin',
    description: 'Ease the creation of the authorization layer',
    fieldDefTypes: FieldShieldType,
    onCreateFieldResolver(config) {
      // Find the field rule
      const fieldRule = config.fieldConfig.extensions?.nexus?.config.shield;

      let rule: ShieldRule<any, any> | undefined;
      if (isShieldRule(fieldRule)) {
        rule = fieldRule;
      } else if (options.defaultRule) {
        rule = options.defaultRule;
      }

      return async (root, args, ctx, info, next) => {
        // Cache
        const shieldCtx = ctx as ShieldContext;
        if (!shieldCtx._shield) {
          shieldCtx._shield = {
            cache: {},
          };
        }

        // Rule
        const allowed = rule
          ? await rule.resolve(root, args, ctx, info, options)
          : true;

        if (!allowed) {
          throw options.defaultError;
        }

        // Resolver
        return next(root, args, ctx, info);
      };
    },
  });
};
