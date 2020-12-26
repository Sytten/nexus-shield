import { extendType, intArg, nonNull, objectType } from 'nexus';
import { isAdmin } from './rules';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.name({
      shield: isAdmin(),
    });
  },
});

export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: User,
      args: {
        id: nonNull(intArg()),
      },
      resolve(_root, { id }, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            id,
          },
        });
      },
    });
  },
});

export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneUser({
      shield: isAdmin(),
    });
  },
});
