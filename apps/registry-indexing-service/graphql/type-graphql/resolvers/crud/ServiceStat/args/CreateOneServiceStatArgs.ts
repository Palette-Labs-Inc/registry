import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ServiceStatCreateInput } from "../../../inputs/ServiceStatCreateInput";

@TypeGraphQL.ArgsType()
export class CreateOneServiceStatArgs {
  @TypeGraphQL.Field(_type => ServiceStatCreateInput, {
    nullable: false
  })
  data!: ServiceStatCreateInput;
}
