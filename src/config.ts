import { GraphQLResolveInfo } from 'graphql';

import { ShieldContext, ShieldRule } from './rules';

type HashFunction = (arg: { root: any; args: any }) => string;

type ErrorMapper = (
  parent: any,
  args: any,
  ctx: ShieldContext,
  info: GraphQLResolveInfo
) => Promise<Error> | Error;

type DefaultError = Error | ErrorMapper;

export interface ShieldPluginOptions {
  defaultRule: ShieldRule<any, any>;
  defaultError: DefaultError;
  hashFunction: HashFunction;
}

export interface ShieldPluginSettings {
  defaultRule?: ShieldRule<any, any>;
  defaultError?: DefaultError;
  hashFunction?: HashFunction;
}
