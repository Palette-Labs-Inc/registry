import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { AggregateServiceStatArgs } from "./args/AggregateServiceStatArgs";
import { CreateManyServiceStatArgs } from "./args/CreateManyServiceStatArgs";
import { CreateOneServiceStatArgs } from "./args/CreateOneServiceStatArgs";
import { DeleteManyServiceStatArgs } from "./args/DeleteManyServiceStatArgs";
import { DeleteOneServiceStatArgs } from "./args/DeleteOneServiceStatArgs";
import { FindFirstServiceStatArgs } from "./args/FindFirstServiceStatArgs";
import { FindFirstServiceStatOrThrowArgs } from "./args/FindFirstServiceStatOrThrowArgs";
import { FindManyServiceStatArgs } from "./args/FindManyServiceStatArgs";
import { FindUniqueServiceStatArgs } from "./args/FindUniqueServiceStatArgs";
import { FindUniqueServiceStatOrThrowArgs } from "./args/FindUniqueServiceStatOrThrowArgs";
import { GroupByServiceStatArgs } from "./args/GroupByServiceStatArgs";
import { UpdateManyServiceStatArgs } from "./args/UpdateManyServiceStatArgs";
import { UpdateOneServiceStatArgs } from "./args/UpdateOneServiceStatArgs";
import { UpsertOneServiceStatArgs } from "./args/UpsertOneServiceStatArgs";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { ServiceStat } from "../../../models/ServiceStat";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateServiceStat } from "../../outputs/AggregateServiceStat";
import { ServiceStatGroupBy } from "../../outputs/ServiceStatGroupBy";

@TypeGraphQL.Resolver(_of => ServiceStat)
export class ServiceStatCrudResolver {
  @TypeGraphQL.Query(_returns => AggregateServiceStat, {
    nullable: false
  })
  async aggregateServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateServiceStatArgs): Promise<AggregateServiceStat> {
    return getPrismaFromContext(ctx).serviceStat.aggregate({
      ...args,
      ...transformInfoIntoPrismaArgs(info),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyServiceStatArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => ServiceStat, {
    nullable: false
  })
  async createOneServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateOneServiceStatArgs): Promise<ServiceStat> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyServiceStatArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => ServiceStat, {
    nullable: true
  })
  async deleteOneServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteOneServiceStatArgs): Promise<ServiceStat | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => ServiceStat, {
    nullable: true
  })
  async findFirstServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstServiceStatArgs): Promise<ServiceStat | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => ServiceStat, {
    nullable: true
  })
  async findFirstServiceStatOrThrow(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstServiceStatOrThrowArgs): Promise<ServiceStat | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.findFirstOrThrow({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [ServiceStat], {
    nullable: false
  })
  async serviceStats(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyServiceStatArgs): Promise<ServiceStat[]> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => ServiceStat, {
    nullable: true
  })
  async serviceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueServiceStatArgs): Promise<ServiceStat | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => ServiceStat, {
    nullable: true
  })
  async getServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueServiceStatOrThrowArgs): Promise<ServiceStat | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.findUniqueOrThrow({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [ServiceStatGroupBy], {
    nullable: false
  })
  async groupByServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByServiceStatArgs): Promise<ServiceStatGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyServiceStatArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => ServiceStat, {
    nullable: true
  })
  async updateOneServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateOneServiceStatArgs): Promise<ServiceStat | null> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => ServiceStat, {
    nullable: false
  })
  async upsertOneServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertOneServiceStatArgs): Promise<ServiceStat> {
    const { _count } = transformInfoIntoPrismaArgs(info);
    return getPrismaFromContext(ctx).serviceStat.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
