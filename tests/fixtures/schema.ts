import { extendType, objectType } from '@nexus/schema';
import { AuthenticationError } from 'apollo-server';

import { ruleType } from '../../src';

export const Test = objectType({
  name: 'Test',
  definition(t) {
    t.id('id');
    t.string('publicProp', {
      shield: ruleType({
        resolve(_root, _args, _ctx) {
          return true;
        },
      }),
    });
    t.string('privateProp', {
      shield: ruleType({
        resolve(_root, _args, _ctx) {
          return false;
        },
      }),
    });
    t.string('throwProp', {
      shield: ruleType({
        resolve(_root, _args, _ctx) {
          throw new AuthenticationError('CUSTOM');
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
          id: 'BEEF',
          publicProp: 'public',
          privateProp: 'private',
          throwProp: 'throwProp',
        };
      },
    });
  },
});
