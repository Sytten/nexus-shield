import { gql } from 'apollo-server';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';

import { server } from './fixtures/server';

describe('Integration tests', () => {
  let client: ApolloServerTestClient;

  beforeAll(() => {
    client = createTestClient(server);
  });

  test('Server should return data', async () => {
    const query = gql`
      query {
        test {
          publicProp
        }
      }
    `;

    const result = await client.query({ query });

    expect(result.data).toEqual({ test: { publicProp: 'public' } });
  });

  test('Server should return default error if not authorized', async () => {
    const query = gql`
      query {
        test {
          privateProp
        }
      }
    `;

    const result = await client.query({ query });

    expect(result.errors[0].message).toEqual('DEFAULT');
  });

  test('Server should return thrown error', async () => {
    const query = gql`
      query {
        test {
          throwProp
        }
      }
    `;

    const result = await client.query({ query });

    expect(result.errors[0].message).toEqual('CUSTOM');
  });

  test('Server should use default object rule', async () => {
    const query = gql`
      query {
        test {
          defaultProp
        }
      }
    `;

    const result = await client.query({ query });

    expect(result.errors[0].message).toEqual('OBJECT');
  });
});
