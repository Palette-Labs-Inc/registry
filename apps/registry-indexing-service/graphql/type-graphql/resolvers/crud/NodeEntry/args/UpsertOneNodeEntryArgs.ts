import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NodeEntryCreateInput } from "../../../inputs/NodeEntryCreateInput";
import { NodeEntryUpdateInput } from "../../../inputs/NodeEntryUpdateInput";
import { NodeEntryWhereUniqueInput } from "../../../inputs/NodeEntryWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertOneNodeEntryArgs {
  @TypeGraphQL.Field(_type => NodeEntryWhereUniqueInput, {
    nullable: false
  })
  where!: NodeEntryWhereUniqueInput;

  @TypeGraphQL.Field(_type => NodeEntryCreateInput, {
    nullable: false
  })
  create!: NodeEntryCreateInput;

  @TypeGraphQL.Field(_type => NodeEntryUpdateInput, {
    nullable: false
  })
  update!: NodeEntryUpdateInput;
}
