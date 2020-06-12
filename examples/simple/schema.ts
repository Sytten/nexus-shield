import { extendType, objectType, enumType } from '@nexus/schema';
import { ruleType } from 'nexus-shield';

export const EnumTest = enumType({
  name: 'EnumTest',
  members: ['test'],
});

export const Test = objectType({
  name: 'Test',
  definition(t) {
    t.id('id');
    t.string('prop', {
      shield: ruleType({
        resolve(root, args, ctx) {
          return true;
        },
      }),
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
