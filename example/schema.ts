import { extendType, objectType, enumType, stringArg } from '@nexus/schema';
import { rule, allow, and, ruleType } from '../src';

const hasScope = (scope: string) => {
  return ruleType({
    resolve: (root, args, ctx, info) => {
      const permissions = [];
      return permissions.includes(scope);
    },
  });
};

export const EnumTest = enumType({
  name: 'EnumTest',
  members: ['test'],
});

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.id('id');
    t.string('prop', {
      shield: ruleType({
        resolve: (root, args, ctx, info) => {
          return true;
        },
      }),
    });
  },
});

export const Test = objectType({
  name: 'Test',
  definition(t) {
    t.id('id');
    t.string('prop');
    t.field('test', {
      type: EnumTest,
      args: { name: stringArg() },
      shield: and(
        rule()((_root, _args, _ctx, _info) => {
          return true;
        }),
        a,
        allow
      ),
      resolve(_root) {
        return 'test';
      },
    });
  },
});

const a = ruleType({
  resolve: (_root, _args, _ctx, _info) => {
    return true;
  },
});

export const QueryTest = extendType({
  type: 'Query',
  definition(t) {
    t.field('test', {
      type: Test,
      resolve(_root, _args, _ctx) {
        return {
          id: 'asdjkasdfnka',
          prop: 'prop',
        };
      },
    });
  },
});
