import { allow, nexusShield } from 'nexus-shield';
import { ApolloServer, ForbiddenError } from 'apollo-server';
import * as path from 'path';
import { makeSchema } from '@nexus/schema';

import * as types from './schema';
import { createContext } from './context';

const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, 'api.graphql'),
    typegen: path.join(__dirname.replace(/\/dist$/, '/src'), 'typegen.ts'),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname.replace(/\/dist$/, '/src'), './context.ts'),
        alias: 'ctx',
      },
    ],
    contextType: 'ctx.Context',
  },
  plugins: [
    nexusShield({
      defaultError: new ForbiddenError('Not allowed'),
      defaultRule: allow,
    }),
  ],
  prettierConfig: path.join(__dirname, '../../../.prettierrc'),
});

const server = new ApolloServer({
  schema,
  context: createContext,
});

const port = process.env.PORT || 4000;

server.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);
