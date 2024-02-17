import * as TypeGraphQL from "type-graphql";
import type { GraphQLResolveInfo } from "graphql";
import { DeleteOneServiceStatArgs } from "./args/DeleteOneServiceStatArgs";
import { ServiceStat } from "../../../models/ServiceStat";
import { transformInfoIntoPrismaArgs, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => ServiceStat)
export class DeleteOneServiceStatResolver {
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
}
