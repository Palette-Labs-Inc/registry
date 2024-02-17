import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NodeEntryOrderByWithRelationInput } from "../../../inputs/NodeEntryOrderByWithRelationInput";
import { NodeEntryWhereInput } from "../../../inputs/NodeEntryWhereInput";
import { NodeEntryWhereUniqueInput } from "../../../inputs/NodeEntryWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateNodeEntryArgs {
  @TypeGraphQL.Field(_type => NodeEntryWhereInput, {
    nullable: true
  })
  where?: NodeEntryWhereInput | undefined;

  @TypeGraphQL.Field(_type => [NodeEntryOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: NodeEntryOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => NodeEntryWhereUniqueInput, {
    nullable: true
  })
  cursor?: NodeEntryWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
