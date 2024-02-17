import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { FindFirstNodeEntryOrThrowArgs } from "./args/FindFirstNodeEntryOrThrowArgs";
import { NodeEntry } from "../../../models/NodeEntry";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => NodeEntry)
export class FindFirstNodeEntryOrThrowResolver {
  @TypeGraphQL.Query(_returns => NodeEntry, {
    nullable: true
  })
  async findFirstNodeEntryOrThrow(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstNodeEntryOrThrowArgs): Promise<NodeEntry | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.findFirstOrThrow({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
