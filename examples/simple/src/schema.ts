import { extendType, objectType, stringArg } from '@nexus/schema';
import { ruleType } from 'nexus-shield';

export const Test = objectType({
  name: 'Test',
  definition(t) {
    t.id('id');
    t.string('prop', {
      args: {
        filter: stringArg({ nullable: false }),
      },
      shield: ruleType({
        resolve(_root, _args, _ctx) {
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
