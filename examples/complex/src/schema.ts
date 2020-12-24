import { extendType, nonNull, objectType, stringArg } from 'nexus';

import { chain, partial, ruleType } from 'nexus-shield';
import { isAuthenticated, isAdmin } from './rules';

const viewerIsOwner = partial<'Test'>(
  chain(
    isAuthenticated(),
    ruleType({
      resolve: (root, _args, ctx) => {
        return root.ownerId === ctx.user.id;
      },
    })
  )
);

export const Test = objectType({
  name: 'Test',
  definition(t) {
    t.id('id');
    t.string('ownerId');
    t.string('ownerProp', {
      args: {
        filter: nonNull(stringArg()),
      },
      shield: viewerIsOwner(),
    });
    t.string('adminProp', {
      shield: isAdmin(),
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
          ownerId: 'sytten',
          ownerProp: 'prop',
          adminProp: 'otherProp',
        };
      },
    });
  },
});
