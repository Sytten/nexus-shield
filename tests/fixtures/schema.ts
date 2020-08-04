import { extendType, objectType } from '@nexus/schema';
import { AuthenticationError } from 'apollo-server';

import { ruleType } from '../../src';

export const Test = objectType({
  name: 'Test',
  shield: ruleType({
    resolve(_root, _args, _ctx) {
      throw new AuthenticationError('OBJECT');
    },
  }),
  definition(t) {
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
    t.string('defaultProp');
  },
});

export const QueryTest = extendType({
  type: 'Query',
  definition(t) {
    t.field('test', {
      type: Test,
      resolve(_root, _args, _ctx) {
        return {
          publicProp: 'public',
          privateProp: 'private',
          throwProp: 'throwProp',
          defaultProp: 'defaultProp',
        };
      },
    });
  },
});
