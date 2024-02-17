import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { FindManyServiceStatArgs } from "./args/FindManyServiceStatArgs";
import { ServiceStat } from "../../../models/ServiceStat";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => ServiceStat)
export class FindManyServiceStatResolver {
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
}
