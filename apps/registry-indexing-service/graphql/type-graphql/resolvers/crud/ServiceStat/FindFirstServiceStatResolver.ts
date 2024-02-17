import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { FindFirstServiceStatArgs } from "./args/FindFirstServiceStatArgs";
import { ServiceStat } from "../../../models/ServiceStat";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => ServiceStat)
export class FindFirstServiceStatResolver {
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
}
