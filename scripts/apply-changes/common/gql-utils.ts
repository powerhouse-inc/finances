import { GraphQLError } from "graphql";
import { type request, GraphQLClient } from "graphql-request";

export type GraphQLResult<T> = { [K in keyof T]: T[K] | null } & {
  errors?: GraphQLError[];
};

type ReqGraphQLError = {
  message: string;
};

export async function queryGraphQL<T>(
  ...args: Parameters<typeof request>
): Promise<GraphQLResult<T>> {
  const [url, ...requestArgs] = args;
  const client = new GraphQLClient(url, { fetch });

  const { errors, ...response } = await client.request<
    { [K in keyof T]: T[K] | null } & { errors?: ReqGraphQLError[] }
  >(...requestArgs);

  const result = { ...response } as GraphQLResult<T>;

  if (errors?.length) {
    result.errors = errors.map(
      ({ message, ...options }) => new GraphQLError(message, options),
    );
  }

  return result;
}
