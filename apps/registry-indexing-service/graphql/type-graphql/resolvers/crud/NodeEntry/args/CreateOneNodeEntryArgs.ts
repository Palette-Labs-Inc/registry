import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NodeEntryCreateInput } from "../../../inputs/NodeEntryCreateInput";

@TypeGraphQL.ArgsType()
export class CreateOneNodeEntryArgs {
  @TypeGraphQL.Field(_type => NodeEntryCreateInput, {
    nullable: false
  })
  data!: NodeEntryCreateInput;
}
