import { extendType, objectType, enumType } from '@nexus/schema';
import { rule, deny, allow, rule2, and } from '../src';

export const EnumTest = enumType({
  name: 'EnumTest',
  members: ['test'],
});

const a = rule2<any, any>({
  resolve: (_root, _args, _ctx, _info) => {
    return true;
  },
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
        allow
      ),
      resolve(_root) {
        return 'test';
      },
    });
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
