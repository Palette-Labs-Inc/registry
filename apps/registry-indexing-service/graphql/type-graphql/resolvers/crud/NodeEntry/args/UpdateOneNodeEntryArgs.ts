import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NodeEntryUpdateInput } from "../../../inputs/NodeEntryUpdateInput";
import { NodeEntryWhereUniqueInput } from "../../../inputs/NodeEntryWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateOneNodeEntryArgs {
  @TypeGraphQL.Field(_type => NodeEntryUpdateInput, {
    nullable: false
  })
  data!: NodeEntryUpdateInput;

  @TypeGraphQL.Field(_type => NodeEntryWhereUniqueInput, {
    nullable: false
  })
  where!: NodeEntryWhereUniqueInput;
}
