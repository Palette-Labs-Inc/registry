import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { GroupByNodeEntryArgs } from "./args/GroupByNodeEntryArgs";
import { NodeEntry } from "../../../models/NodeEntry";
import { NodeEntryGroupBy } from "../../outputs/NodeEntryGroupBy";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => NodeEntry)
export class GroupByNodeEntryResolver {
  @TypeGraphQL.Query(_returns => [NodeEntryGroupBy], {
    nullable: false
  })
  async groupByNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByNodeEntryArgs): Promise<NodeEntryGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
