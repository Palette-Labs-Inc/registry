import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { AggregateNodeEntryArgs } from "./args/AggregateNodeEntryArgs";
import { NodeEntry } from "../../../models/NodeEntry";
import { AggregateNodeEntry } from "../../outputs/AggregateNodeEntry";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => NodeEntry)
export class AggregateNodeEntryResolver {
  @TypeGraphQL.Query(_returns => AggregateNodeEntry, {
    nullable: false
  })
  async aggregateNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateNodeEntryArgs): Promise<AggregateNodeEntry> {
    return getPrismaFromContext(ctx).nodeEntry.aggregate({
      ...args,
      ...transformInfoIntoPrismaArgs(info),
    });
  }
}
