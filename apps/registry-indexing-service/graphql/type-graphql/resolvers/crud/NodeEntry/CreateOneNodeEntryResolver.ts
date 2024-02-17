import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { CreateOneNodeEntryArgs } from "./args/CreateOneNodeEntryArgs";
import { NodeEntry } from "../../../models/NodeEntry";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => NodeEntry)
export class CreateOneNodeEntryResolver {
  @TypeGraphQL.Mutation(_returns => NodeEntry, {
    nullable: false
  })
  async createOneNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateOneNodeEntryArgs): Promise<NodeEntry> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
