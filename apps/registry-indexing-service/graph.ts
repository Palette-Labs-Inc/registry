import "reflect-metadata";
import {
  resolvers,
  applyResolversEnhanceMap,
  ResolversEnhanceMap,
} from "./graphql/type-graphql";
import { AuthChecker, Authorized, buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { prisma } from "./db.server";

const PORT = process.env.GRAPH_PORT || 3000;

export async function startGraph() {
  const resolversEnhanceMap: ResolversEnhanceMap = {
    NodeEntry: {
      nodeEntry: [Authorized()],
      nodeEntries: [Authorized()],
      findFirstNodeEntry: [Authorized()],
      aggregateNodeEntry: [Authorized()],
      createOneNodeEntry: [Authorized(["ADMIN"])],
      createManyNodeEntry: [Authorized(["ADMIN"])],
      upsertOneNodeEntry: [Authorized(["ADMIN"])],
      updateOneNodeEntry: [Authorized(["ADMIN"])],
      updateManyNodeEntry: [Authorized(["ADMIN"])],
      deleteOneNodeEntry: [Authorized(["ADMIN"])],
      deleteManyNodeEntry: [Authorized(["ADMIN"])],
    },
    ServiceStat: {
      serviceStat: [Authorized()],
      serviceStats: [Authorized()],
      findFirstServiceStat: [Authorized()],
      aggregateServiceStat: [Authorized()],
      createOneServiceStat: [Authorized(["ADMIN"])],
      createManyServiceStat: [Authorized(["ADMIN"])],
      upsertOneServiceStat: [Authorized(["ADMIN"])],
      updateOneServiceStat: [Authorized(["ADMIN"])],
      updateManyServiceStat: [Authorized(["ADMIN"])],
      deleteOneServiceStat: [Authorized(["ADMIN"])],
      deleteManyServiceStat: [Authorized(["ADMIN"])],
    },
  };

  applyResolversEnhanceMap(resolversEnhanceMap);

  const customAuthChecker: AuthChecker = (
    { root, args, context, info },
    roles
  ) => {
    return !roles.includes("ADMIN");
  };

  const schema = await buildSchema({
    resolvers: resolvers,
    validate: false,
    authChecker: customAuthChecker,
  });

  const server = new ApolloServer({
    schema: schema,
    cache: "bounded",
    introspection: true,
    context: () => ({ prisma }),
  });

  const { url } = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}
