import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { AggregateServiceStatArgs } from "./args/AggregateServiceStatArgs";
import { ServiceStat } from "../../../models/ServiceStat";
import { AggregateServiceStat } from "../../outputs/AggregateServiceStat";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => ServiceStat)
export class AggregateServiceStatResolver {
  @TypeGraphQL.Query(_returns => AggregateServiceStat, {
    nullable: false
  })
  async aggregateServiceStat(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateServiceStatArgs): Promise<AggregateServiceStat> {
    return getPrismaFromContext(ctx).serviceStat.aggregate({
      ...args,
      ...transformInfoIntoPrismaArgs(info),
    });
  }
}
