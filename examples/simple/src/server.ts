import { allow, nexusShield } from 'nexus-shield';
import { ApolloServer, ForbiddenError } from 'apollo-server';
import * as path from 'path';
import { makeSchema } from 'nexus';

import * as types from './schema';

export type Context = {
  user: string;
};

const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, 'api.graphql'),
    typegen: path.join(__dirname.replace(/\/dist$/, '/src'), 'typegen.ts'),
  },
  contextType: { module: __filename, export: 'Context' },
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
});

const port = process.env.PORT || 4000;

server.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);
