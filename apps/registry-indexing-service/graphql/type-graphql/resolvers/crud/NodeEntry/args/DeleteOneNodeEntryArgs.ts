import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NodeEntryWhereUniqueInput } from "../../../inputs/NodeEntryWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteOneNodeEntryArgs {
  @TypeGraphQL.Field(_type => NodeEntryWhereUniqueInput, {
    nullable: false
  })
  where!: NodeEntryWhereUniqueInput;
}
