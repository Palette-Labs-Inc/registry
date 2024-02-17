import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NodeEntryUpdateManyMutationInput } from "../../../inputs/NodeEntryUpdateManyMutationInput";
import { NodeEntryWhereInput } from "../../../inputs/NodeEntryWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyNodeEntryArgs {
  @TypeGraphQL.Field(_type => NodeEntryUpdateManyMutationInput, {
    nullable: false
  })
  data!: NodeEntryUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => NodeEntryWhereInput, {
    nullable: true
  })
  where?: NodeEntryWhereInput | undefined;
}
