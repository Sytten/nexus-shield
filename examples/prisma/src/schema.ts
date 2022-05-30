import {
  extendType,
  intArg,
  nonNull,
  objectType,
  inputObjectType,
} from 'nexus';
import { isAdmin } from './rules';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name', {
      shield: isAdmin(),
    });
  },
});

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('name');
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
    t.field('createOneUser', {
      type: User,
      shield: isAdmin(),
      args: {
        input: nonNull(UserCreateInput),
      },
      resolve(_root, { input }, ctx) {
        return ctx.prisma.user.create({
          data: {
            name: input.name,
          },
        });
      },
    });
  },
});
