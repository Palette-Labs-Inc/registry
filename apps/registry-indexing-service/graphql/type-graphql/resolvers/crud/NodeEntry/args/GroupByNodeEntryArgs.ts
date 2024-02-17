import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NodeEntryOrderByWithAggregationInput } from "../../../inputs/NodeEntryOrderByWithAggregationInput";
import { NodeEntryScalarWhereWithAggregatesInput } from "../../../inputs/NodeEntryScalarWhereWithAggregatesInput";
import { NodeEntryWhereInput } from "../../../inputs/NodeEntryWhereInput";
import { NodeEntryScalarFieldEnum } from "../../../../enums/NodeEntryScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByNodeEntryArgs {
  @TypeGraphQL.Field(_type => NodeEntryWhereInput, {
    nullable: true
  })
  where?: NodeEntryWhereInput | undefined;

  @TypeGraphQL.Field(_type => [NodeEntryOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: NodeEntryOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [NodeEntryScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"uid" | "name" | "callbackUrl" | "location" | "industryCode" | "owner" | "nodeType" | "status">;

  @TypeGraphQL.Field(_type => NodeEntryScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: NodeEntryScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
