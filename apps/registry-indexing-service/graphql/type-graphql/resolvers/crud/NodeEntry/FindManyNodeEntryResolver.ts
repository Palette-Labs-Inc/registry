import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { FindManyNodeEntryArgs } from "./args/FindManyNodeEntryArgs";
import { NodeEntry } from "../../../models/NodeEntry";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => NodeEntry)
export class FindManyNodeEntryResolver {
  @TypeGraphQL.Query(_returns => [NodeEntry], {
    nullable: false
  })
  async nodeEntries(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyNodeEntryArgs): Promise<NodeEntry[]> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
