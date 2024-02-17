import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { EnumNodeStatusWithAggregatesFilter } from "../inputs/EnumNodeStatusWithAggregatesFilter";
import { EnumNodeTypeWithAggregatesFilter } from "../inputs/EnumNodeTypeWithAggregatesFilter";
import { StringNullableListFilter } from "../inputs/StringNullableListFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType("NodeEntryScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class NodeEntryScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [NodeEntryScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: NodeEntryScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [NodeEntryScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: NodeEntryScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [NodeEntryScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: NodeEntryScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  uid?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  name?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  callbackUrl?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableListFilter, {
    nullable: true
  })
  location?: StringNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  industryCode?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  owner?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => EnumNodeTypeWithAggregatesFilter, {
    nullable: true
  })
  nodeType?: EnumNodeTypeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => EnumNodeStatusWithAggregatesFilter, {
    nullable: true
  })
  status?: EnumNodeStatusWithAggregatesFilter | undefined;
}
