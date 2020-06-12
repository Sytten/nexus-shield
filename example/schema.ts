import { extendType, objectType, enumType } from '@nexus/schema';
import { rule, allow, and, ruleType } from '../src';

export const EnumTest = enumType({
  name: 'EnumTest',
  members: ['test'],
});

const b = rule()((_root, _args, _ctx, _info) => {
  return true;
});

export const Test = objectType({
  name: 'Test',
  definition(t) {
    t.id('id');
    t.string('prop');
    t.field('test', {
      type: EnumTest,
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
  type: Test.name,
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
