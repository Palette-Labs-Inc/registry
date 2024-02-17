import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ServiceStatUpdateManyMutationInput } from "../../../inputs/ServiceStatUpdateManyMutationInput";
import { ServiceStatWhereInput } from "../../../inputs/ServiceStatWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyServiceStatArgs {
  @TypeGraphQL.Field(_type => ServiceStatUpdateManyMutationInput, {
    nullable: false
  })
  data!: ServiceStatUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => ServiceStatWhereInput, {
    nullable: true
  })
  where?: ServiceStatWhereInput | undefined;
}
