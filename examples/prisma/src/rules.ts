import { chain, generic, ruleType, ShieldCache } from 'nexus-shield';

export const isAuthenticated = generic(
  ruleType({
    cache: ShieldCache.CONTEXTUAL,
    resolve: (_root, _args, ctx) => {
      return !!ctx.user;
    },
  })
);

export const isAdmin = generic(
  chain(
    isAuthenticated(),
    ruleType({
      cache: ShieldCache.CONTEXTUAL,
      resolve: (_root, _args, ctx) => {
        return !!ctx.user?.isAdmin;
      },
    })
  )
);
