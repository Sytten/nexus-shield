import { plugin } from 'nexus';
import { printedGenTyping, printedGenTypingImport } from 'nexus/dist/utils';
import * as hash from 'object-hash';

import { allow } from './builders';
import { ShieldPluginSettings } from './config';
import { ShieldContext, ShieldRule } from './rules';
import { isShieldRule } from './utils';

const FieldShieldImport = printedGenTypingImport({
  module: 'nexus-shield',
  bindings: ['FieldShieldResolver'],
});

const FieldShieldType = printedGenTyping({
  optional: true,
  name: 'shield',
  description: `
    Authorization rule to execute for this field
  `,
  type: 'FieldShieldResolver<TypeName, FieldName>',
  imports: [FieldShieldImport],
});

export type FieldShieldResolver<
  TypeName extends string,
  FieldName extends string
> = ShieldRule<TypeName, FieldName>;

const ObjectTypeShieldImport = printedGenTypingImport({
  module: 'nexus-shield',
  bindings: ['ObjectTypeShieldResolver'],
});

const ObjectTypeFieldShieldType = printedGenTyping({
  optional: true,
  name: 'shield',
  description: `
    Default authorization rule to execute on all fields of this object
  `,
  type: 'ObjectTypeShieldResolver<TypeName>',
  imports: [ObjectTypeShieldImport],
});

export type ObjectTypeShieldResolver<TypeName extends string> = ShieldRule<
  TypeName,
  never
>;

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
    objectTypeDefTypes: ObjectTypeFieldShieldType,
    onCreateFieldResolver(config) {
      // Find the field rule
      const objectRule =
        config.parentTypeConfig.extensions?.nexus?.config.shield;
      const fieldRule = config.fieldConfig.extensions?.nexus?.config.shield;

      let rule: ShieldRule<any, any> | undefined;
      if (isShieldRule(fieldRule)) {
        rule = fieldRule;
      } else if (isShieldRule(objectRule)) {
        rule = objectRule;
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
          let error = options.defaultError;
          if (typeof error === 'function') {
            error = await error(root, args, ctx, info);
          }
          throw error;
        }

        // Resolver
        return next(root, args, ctx, info);
      };
    },
  });
};
