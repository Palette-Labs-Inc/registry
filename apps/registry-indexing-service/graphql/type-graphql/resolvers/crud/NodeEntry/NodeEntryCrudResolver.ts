import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { AggregateNodeEntryArgs } from "./args/AggregateNodeEntryArgs";
import { CreateManyNodeEntryArgs } from "./args/CreateManyNodeEntryArgs";
import { CreateOneNodeEntryArgs } from "./args/CreateOneNodeEntryArgs";
import { DeleteManyNodeEntryArgs } from "./args/DeleteManyNodeEntryArgs";
import { DeleteOneNodeEntryArgs } from "./args/DeleteOneNodeEntryArgs";
import { FindFirstNodeEntryArgs } from "./args/FindFirstNodeEntryArgs";
import { FindFirstNodeEntryOrThrowArgs } from "./args/FindFirstNodeEntryOrThrowArgs";
import { FindManyNodeEntryArgs } from "./args/FindManyNodeEntryArgs";
import { FindUniqueNodeEntryArgs } from "./args/FindUniqueNodeEntryArgs";
import { FindUniqueNodeEntryOrThrowArgs } from "./args/FindUniqueNodeEntryOrThrowArgs";
import { GroupByNodeEntryArgs } from "./args/GroupByNodeEntryArgs";
import { UpdateManyNodeEntryArgs } from "./args/UpdateManyNodeEntryArgs";
import { UpdateOneNodeEntryArgs } from "./args/UpdateOneNodeEntryArgs";
import { UpsertOneNodeEntryArgs } from "./args/UpsertOneNodeEntryArgs";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { NodeEntry } from "../../../models/NodeEntry";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateNodeEntry } from "../../outputs/AggregateNodeEntry";
import { NodeEntryGroupBy } from "../../outputs/NodeEntryGroupBy";

@TypeGraphQL.Resolver(_of => NodeEntry)
export class NodeEntryCrudResolver {
  @TypeGraphQL.Query(_returns => AggregateNodeEntry, {
    nullable: false
  })
  async aggregateNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateNodeEntryArgs): Promise<AggregateNodeEntry> {
    return getPrismaFromContext(ctx).nodeEntry.aggregate({
      ...args,
      ...transformInfoIntoPrismaArgs(info),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyNodeEntryArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

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

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyNodeEntryArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => NodeEntry, {
    nullable: true
  })
  async deleteOneNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteOneNodeEntryArgs): Promise<NodeEntry | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => NodeEntry, {
    nullable: true
  })
  async findFirstNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstNodeEntryArgs): Promise<NodeEntry | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

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

  @TypeGraphQL.Query(_returns => NodeEntry, {
    nullable: true
  })
  async nodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueNodeEntryArgs): Promise<NodeEntry | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

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

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyNodeEntryArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => NodeEntry, {
    nullable: true
  })
  async updateOneNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateOneNodeEntryArgs): Promise<NodeEntry | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => NodeEntry, {
    nullable: false
  })
  async upsertOneNodeEntry(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertOneNodeEntryArgs): Promise<NodeEntry> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).nodeEntry.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
