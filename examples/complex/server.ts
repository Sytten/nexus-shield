import { ApolloServer } from 'apollo-server';
import * as path from 'path';
import { makeSchema } from '@nexus/schema';

import * as types from './schema';

const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, 'api.graphql'),
    typegen: path.join(__dirname.replace(/\/dist$/, '/src'), 'typegen.ts'),
  },
  typegenAutoConfig: {
    sources: [],
    contextType: '{ user: string }',
  },
  prettierConfig: path.join(__dirname, '../../.prettierrc'),
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
