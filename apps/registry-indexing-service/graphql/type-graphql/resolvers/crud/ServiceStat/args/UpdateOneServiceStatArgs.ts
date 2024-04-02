import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ServiceStatUpdateInput } from "../../../inputs/ServiceStatUpdateInput";
import { ServiceStatWhereUniqueInput } from "../../../inputs/ServiceStatWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateOneServiceStatArgs {
  @TypeGraphQL.Field(_type => ServiceStatUpdateInput, {
    nullable: false
  })
  data!: ServiceStatUpdateInput;

  @TypeGraphQL.Field(_type => ServiceStatWhereUniqueInput, {
    nullable: false
  })
  where!: ServiceStatWhereUniqueInput;
}
