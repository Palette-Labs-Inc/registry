import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { GroupByServiceStatArgs } from "./args/GroupByServiceStatArgs";
import { ServiceStat } from "../../../models/ServiceStat";
import { ServiceStatGroupBy } from "../../outputs/ServiceStatGroupBy";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => ServiceStat)
export class GroupByServiceStatResolver {
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
}
