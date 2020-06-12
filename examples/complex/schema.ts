import { extendType, objectType } from '@nexus/schema';

export const Test = objectType({
  name: 'Test',
  definition(t) {
    t.id('id');
    t.string('prop');
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
