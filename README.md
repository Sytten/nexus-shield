# nexus-shield

**STATUS: EXPERIMENTAL**
The package is not ready for production usage, use at your own risk. The API is likely to change and tests have not yet been written.

## Overview

Nexus Shield is a [@nexus/schema](https://github.com/graphql-nexus/schema) plugin that helps you create an authorization layer for your application. It is a replacement for the provided authorization plugin. It is heavily inspired by [Graphql Shield](https://github.com/maticzav/graphql-shield) and reuses most of it's familiar ruling system. It takes full advantage of the type safety provided by nexus.

## Install

```bash
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
const isAuthenticated = rule()((root, args, ctx, info) => {
  return !!ctx.user;
});
```

#### Nexus

```typescript
const isAuthenticated = ruleType({
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
  resolve: (root, args, ctx, info) => {
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
    resolve: (root, args, ctx, info) => {
      return ctx.user.permissions.includes(scope);
    },
  });
};

const backlist = ruleType({
  resolve: (root, args, ctx, info) => {
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
      shield: isAuthenticated,
    });
  },
});
```

### Type safety

This plugin will try its best to provide typing to the rules.

- It is **preferable** to define rules directly in the `definition` to have access to the full typing of `root` and `args`.
- The `ctx` is always typed if it was properly configured in nexus `makeSchema`.

```typescript
export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.id('id');
    t.string('prop', {
      shield: ruleType({
        resolve: (root, args, ctx, info) => {
          // root => { id: string }, args => {}
          return true;
        },
      }),
    });
  },
});
```

Note that is is also possible to type rules created outside of the `definition`.

#### Using generics:

```typescript
const isAuthenticated = ruleType<'Product', any>({
  resolve: (root, args, ctx, info) => {
    // root will be typed, but not args
    const allowed = !!ctx.user;
    if (!allowed) return new AuthenticationError('Bearer token required');
    return allowed;
  },
});
```

#### Using parameters:

```typescript
const isAuthenticated = ruleType({
  type: Product.name, // or 'Product'
  field: 'prop',
  resolve: (root, args, ctx, info) => {
    // both root and args are typed
    const allowed = !!ctx.user;
    if (!allowed) return new AuthenticationError('Bearer token required');
    return allowed;
  },
});
```

### Known issues / limitations

- If using untyped rules, the `any` will back propagate through the operators. This causes rules to be accepted even if they are not compatible.

```typescript
const badRule = ruleType({
  type: 'AnotherType',
  resolve: (root, args, ctx, info) => {
    return true;
  },
});

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.id('id');
    t.string('prop', {
      shield: chain(
        badRule, // Is wrongly allowed because isAuthenticated caused chain to become ShieldRule<any, any>
        isAuthenticated,
        ruleType({
          resolve: (root, args, ctx, info) => {
            // root and args are properly typed
            return true;
          },
        })
      ),
    });
  },
});
```

- It is not possible to pass directly an `objectType` to the parameter `type` of a `ruleType`. Tracked by issue: https://github.com/graphql-nexus/schema/issues/451
