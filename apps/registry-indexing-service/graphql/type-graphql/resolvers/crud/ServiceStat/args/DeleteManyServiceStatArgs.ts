import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ServiceStatWhereInput } from "../../../inputs/ServiceStatWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyServiceStatArgs {
  @TypeGraphQL.Field(_type => ServiceStatWhereInput, {
    nullable: true
  })
  where?: ServiceStatWhereInput | undefined;
}
