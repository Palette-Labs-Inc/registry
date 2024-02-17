import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NodeEntryCountOrderByAggregateInput } from "../inputs/NodeEntryCountOrderByAggregateInput";
import { NodeEntryMaxOrderByAggregateInput } from "../inputs/NodeEntryMaxOrderByAggregateInput";
import { NodeEntryMinOrderByAggregateInput } from "../inputs/NodeEntryMinOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("NodeEntryOrderByWithAggregationInput", {
  isAbstract: true
})
export class NodeEntryOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  uid?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  name?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  callbackUrl?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  location?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  industryCode?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  owner?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  nodeType?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  status?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => NodeEntryCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: NodeEntryCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => NodeEntryMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: NodeEntryMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => NodeEntryMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: NodeEntryMinOrderByAggregateInput | undefined;
}
