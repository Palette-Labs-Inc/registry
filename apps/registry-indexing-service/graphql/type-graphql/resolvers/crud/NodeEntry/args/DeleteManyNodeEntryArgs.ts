import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NodeEntryWhereInput } from "../../../inputs/NodeEntryWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyNodeEntryArgs {
  @TypeGraphQL.Field(_type => NodeEntryWhereInput, {
    nullable: true
  })
  where?: NodeEntryWhereInput | undefined;
}
