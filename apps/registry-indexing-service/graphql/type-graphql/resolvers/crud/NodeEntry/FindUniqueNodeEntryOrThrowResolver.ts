import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { FindUniqueNodeEntryOrThrowArgs } from "./args/FindUniqueNodeEntryOrThrowArgs";
import { NodeEntry } from "../../../models/NodeEntry";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => NodeEntry)
export class FindUniqueNodeEntryOrThrowResolver {
  @TypeGraphQL.Query(_returns => NodeEntry, {
    nullable: true
  })
  async getNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueNodeEntryOrThrowArgs): Promise<NodeEntry | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.findUniqueOrThrow({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
