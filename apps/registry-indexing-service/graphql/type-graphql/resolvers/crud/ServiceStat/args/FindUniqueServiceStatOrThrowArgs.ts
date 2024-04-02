import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ServiceStatWhereUniqueInput } from "../../../inputs/ServiceStatWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueServiceStatOrThrowArgs {
  @TypeGraphQL.Field(_type => ServiceStatWhereUniqueInput, {
    nullable: false
  })
  where!: ServiceStatWhereUniqueInput;
}
