import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ServiceStatCreateInput } from "../../../inputs/ServiceStatCreateInput";
import { ServiceStatUpdateInput } from "../../../inputs/ServiceStatUpdateInput";
import { ServiceStatWhereUniqueInput } from "../../../inputs/ServiceStatWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertOneServiceStatArgs {
  @TypeGraphQL.Field(_type => ServiceStatWhereUniqueInput, {
    nullable: false
  })
  where!: ServiceStatWhereUniqueInput;

  @TypeGraphQL.Field(_type => ServiceStatCreateInput, {
    nullable: false
  })
  create!: ServiceStatCreateInput;

  @TypeGraphQL.Field(_type => ServiceStatUpdateInput, {
    nullable: false
  })
  update!: ServiceStatUpdateInput;
}
