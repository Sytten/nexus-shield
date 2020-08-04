import { makeSchema } from '@nexus/schema';
import { ApolloServer, ForbiddenError } from 'apollo-server';
import * as path from 'path';

import {
  allow,
  FieldShieldResolver,
  nexusShield,
  ObjectTypeShieldResolver,
} from '../../src';
import * as types from './schema';

declare global {
  interface NexusGenPluginFieldConfig<
    TypeName extends string,
    FieldName extends string
  > {
    shield?: FieldShieldResolver<TypeName, FieldName>;
  }

  interface NexusGenPluginTypeConfig<TypeName extends string> {
    shield?: ObjectTypeShieldResolver<TypeName>;
  }
}

const schema = makeSchema({
  types,
  outputs: false,
  plugins: [
    nexusShield({
      defaultError: new ForbiddenError('DEFAULT'),
      defaultRule: allow,
    }),
  ],
  prettierConfig: path.join(__dirname, '../../../.prettierrc'),
});

export const server = new ApolloServer({
  schema,
});
