# nexus-shield

[![Github Actions](https://github.com/Sytten/nexus-shield/workflows/Release/badge.svg)](https://circleci.com/gh/maticzav/graphql-shield/tree/master)
[![codecov](https://codecov.io/gh/Sytten/nexus-shield/branch/master/graph/badge.svg)](https://codecov.io/gh/Sytten/nexus-shield)
[![npm version](https://badge.fury.io/js/nexus-shield.svg)](https://badge.fury.io/js/nexus-shield)

**STATUS: EXPERIMENTAL**
The package has not yet been battle tested, use at your own risk and report any bug you find.

## Overview

Nexus Shield is a [@nexus/schema](https://github.com/graphql-nexus/schema) plugin that helps you create an authorization layer for your application. It is a replacement for the provided authorization plugin. It is heavily inspired by [Graphql Shield](https://github.com/maticzav/graphql-shield) and reuses most of it's familiar ruling system. It takes full advantage of the type safety provided by nexus.

## Install

```bash
npm install --save nexus-shield

OR

yarn add nexus-shield
```

## Usage

### Nexus configuration

The plugin first needs to be installed in nexus. This will add the new `shield` parameter. The plugin will work without any provided configuration, but it is recommended to provide one that is relevant to your application.

For example, using an [Apollo server](https://www.apollographql.com/server/):

```typescript
import { nexusShield } from 'nexus-shield';
import { ForbiddenError } from 'apollo-server';

const schema = makeSchema({
  // ... Rest of the configuration
  plugins: [
    nexusShield({
      defaultError: new ForbiddenError('Not allowed'),
      defaultRule: allow,
    }),
  ],
});
```

### Styles

Two interfaces styles are provided for convenience: `Graphql-Shield` and `Nexus`

#### Graphql-Shield

```typescript
rule()((root, args, ctx) => {
  return !!ctx.user;
});
```

#### Nexus

```typescript
ruleType({
  resolve: (root, args, ctx, info) => {
    return !!ctx.user;
  },
});
```

### Error

A rule needs to return a `boolean`, a `Promise<boolean>` or throw an `Error`. Contrary to Graphql-shield, this plugin will **NOT** catch the errors you throw and will just pass them down to the next plugins and eventually to the server. If `false` is returned, the configured `defaultError` will be thrown by the plugin.

```typescript
import { AuthenticationError } from 'apollo-server';

const isAuthenticated = ruleType({
  resolve: (root, args, ctx) => {
    const allowed = !!ctx.user;
    if (!allowed) return new AuthenticationError('Bearer token required');
    return allowed;
  },
});
```

### Operators

Rules can be combined in a very flexible manner. The plugin provides the following operators:

- `and`: Returns `true` if **all** rules returns `true`
- `or`: Returns `true` if **one** rule returns `true`
- `not`: Inverts the result of a rule
- `chain`: Same as `and`, but rules are executed in order
- `race`: Same as `or`, but rules are executed in order
- `deny`: Returns `false`
- `allow`: Returns `true`

Simple example:

```typescript
import { chain, not, ruleType } from 'nexus-shield';

const hasScope = (scope: string) => {
  return ruleType({
    resolve: (root, args, ctx) => {
      return ctx.user.permissions.includes(scope);
    },
  });
};

const backlist = ruleType({
  resolve: (root, args, ctx) => {
    return ctx.user.token === 'some-token';
  },
});

const viewerIsAuthorized = chain(
  isAuthenticated,
  not(backlist),
  hasScope('products:read')
);
```

### Shield Parameter

To use a rule, it must be assigned to the `shield` parameter of a field:

```typescript
export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.id('id');
    t.string('prop', {
      shield: ruleType({
        resolve: (root, args, ctx) => {
          return !!ctx.user;
        },
      }),
    });
  },
});
```

### Type safety

This plugin will try its best to provide typing to the rules.

- It is **preferable** to define rules directly in the `definition` to have access to the full typing of `root` and `args`.
- The `ctx` is always typed if it was properly configured in nexus `makeSchema`.
- If creating generic or partial rules, use the appropriate helpers (see below).

```typescript
export type Context = {
  user?: { id: string };
};

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.id('id');
    t.string('ownerId');
    t.string('prop', {
      args: {
        filter: stringArg({ nullable: false }),
      },
      shield: ruleType({
        resolve: (root, args, ctx) => {
          // root => { id: string }, args => { filter: string }, ctx => Context
          return true;
        },
      }),
    });
  },
});
```

#### Generic rules

- Generic rules are rules that do not depend on the type of the `root` or `args`.
- The wrapper `generic` is provided for this purpose. It will wrap your rule in a generic function.

```typescript
const isAuthenticated = generic(
  ruleType({
    resolve: (root, args, ctx) => {
      // Only ctx is typed
      return !!ctx.user;
    },
  })
);

// Usage
t.string('prop', {
  shield: isAuthenticated(),
});
```

#### Partial rules

- Generic rules are rules that depend only on the type of the `root`.
- The wrapper `partial` is provided for this purpose. It will wrap your rule in a generic function.

```typescript
const viewerIsOwner = partial(
  ruleType({
    type: 'Product' // It is also possible to use the generic parameter of `partial`
    resolve: (root, args, ctx) => {
      // Both root and ctx are typed
      return root.ownerId === ctx.user.id;
    },
  })
);

// Usage
t.string('prop', {
  shield: viewerIsOwner(),
});
```

#### Combining rules

If you mix and match generic rules with partial rules, you will need to specify the type in the parent helper.

```typescript
const viewerIsAuthorized = partial<'Product'>(
  chain(isAuthenticated(), viewerIsOwner())
);
```

However, if you specify it directly in the `shield` field, there is not need for an hlper thus no need for a parameter.

```typescript
t.string('prop', {
  shield: chain(isAuthenticated(), viewerIsOwner()),
});
```

### Known issues / limitations

- It is not possible to pass directly an `objectType` to the parameter `type` of a `ruleType`. Tracked by issue: https://github.com/graphql-nexus/schema/issues/451

- The helpers are necessary to provide strong typing and avoid the propagation of `any`. See [this StackOverflow issue](https://stackoverflow.com/questions/62363077/combining-typescript-generics-with-any-without-losing-type/62435780#62435780) for more on the subject.
