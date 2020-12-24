import { AuthenticationError } from 'apollo-server';
import { extendType, objectType } from 'nexus';

import { ruleType } from '../../src';

export const Test = objectType({
  name: 'Test',
  shield: ruleType({
    resolve(_source, _args, _ctx) {
      throw new AuthenticationError('OBJECT');
    },
  }),
  definition(t) {
    t.string('publicProp', {
      shield: ruleType({
        resolve(_source, _args, _ctx) {
          return true;
        },
      }),
    });
    t.string('privateProp', {
      shield: ruleType({
        resolve(_source, _args, _ctx) {
          return false;
        },
      }),
    });
    t.string('throwProp', {
      shield: ruleType({
        resolve(_source, _args, _ctx) {
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
      resolve(_source, _args, _ctx) {
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
